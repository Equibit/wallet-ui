/**
 * @module {can-map} models/user User
 * @parent models.auth
 *
 * User model
 *
 * @group models/user.properties 0 properties
 * @group models/user.prototype 1 prototype
 * @group models/user.static 2 static
 */

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import signed from '~/models/feathers-signed';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';
import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';
import cryptoUtils from '~/utils/crypto';
import connect from 'can-connect';
import login from './login';
import Portfolio from '~/models/portfolio';

const userService = feathersClient.service('users');

let _password;
let _keys;
const _network = bitcoin.networks.testnet;

const User = DefineMap.extend('User', {
  /**
   * @function models/user.static.login login
   * @parent models/user.static
   * Updates user password.
   *
   * @signature `User.login( email, password )`
   * @param {String} email
   * @param {String} password
   */
  login,

  /**
   * @function models/user.static.signup signup
   * @parent models/user.static
   * Creates a new user. No password is required since server will email a temporary password.
   *
   * @signature `User.signup( email )`
   * @param {String} email User's email.
   */
  signup (email) {
    return feathersClient.service('users').create({ email });
  },

  /**
   * @function models/user.static.forgotPassword forgotPassword
   * @parent models/user.static
   * Sends a forgot-password request. Server will send an email with a temporary password.
   *
   * @signature `User.forgotPassword( email )`
   * @param {String} email User's email.
   */
  forgotPassword (email) {
    return feathersClient.service('forgot-password').create({email});
  }
}, {
  /**
   * @property {String} models/user.properties._id _id
   * @parent models/user.properties
   * Id of a user.
   */
  _id: 'string',

  /**
   * @property {String} models/user.properties.email email
   * @parent models/user.properties
   * Email of a user.
   */
  email: 'string',

  encryptedKey: 'string',

  encryptedMnemonic: 'string',

  salt: 'string',

  /**
   * @property {Boolean} models/user.properties.isNewUser isNewUser
   * @parent models/user.properties
   * Indicates whether the user has just been created with server-generated tmp password.
   */
  isNewUser: 'boolean',

  portfolios: {
    set (val) {
      const list = new Portfolio.List(val.data);
      list.balance = val.balance;
      return list;
    }
  },

  /**
   * @property {Date} models/user.properties.createdAt createdAt
   * @parent models/user.properties
   * Date of user creation.
   */
  createdAt: 'date',

  /**
   * @property {Date} models/user.properties.isNewUser isNewUser
   * @parent models/user.properties
   * Date of user update.
   */
  updatedAt: 'date',

  /**
   * @property {Function} models/user.prototype.generateWalletKeys generateWalletKeys
   * @parent models/user.prototype
   * Generates keys for a new user account.
   */
  // Q: do we want different passphrases for mnemonic and privateKey? A: Not now.
  generateWalletKeys () {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeed(mnemonic, '');
    const root = bitcoin.HDNode.fromSeedBuffer(seed, _network);

    this.encryptedMnemonic = this.encryptWithPassword(_password, mnemonic);
    this.encryptedKey = this.encryptWithPassword(_password, root.toBase58());

    return userService.patch(this._id, {
      encryptedMnemonic: this.encryptedMnemonic,
      encryptedKey: this.encryptedKey
    }).then(() => this.cacheWalletKeys(root));
  },

  /**
   * @property {Function} models/user.prototype.generateWalletKeys generateWalletKeys
   * @parent models/user.prototype
   * Cache BTC and EQB keys in a closure.
   */
  cacheWalletKeys (root) {
    const keyPairBTC = root.derivePath("m/44'/0'");
    const keyPairEQB = root.derivePath("m/44'/73'");

    _keys = {
      root: root,
      btc: keyPairBTC,
      eqb: keyPairEQB
    };
    return this;
  },

  /**
   * @property {Function} models/user.prototype.loadWalletKeys loadWalletKeys
   * @parent models/user.prototype
   * Generate HD node and wallet keys from the encrypted master key.
   */
  loadWalletKeys () {
    const base58Key = this.decryptWithPassword(_password, this.encryptedKey);
    const root = bitcoin.HDNode.fromBase58(base58Key, _network);
    this.cacheWalletKeys(root);
  },

  /**
   * @property {Function} models/user.prototype.generatePortfolioKeys generatePortfolioKeys
   * @parent models/user.prototype
   * Generates keys for a new Portfolio.
   */
  generatePortfolioKeys (index) {
    if (!_keys || !_keys.btc || !_keys.eqb){
      console.warn('No keys exist. Cannot generate portfolio keys');
      return;
    }
    return {
      btc: _keys.btc.deriveHardened(index),
      eqb: _keys.eqb.deriveHardened(index)
    };
  },
  signWithPrivateKey () {
    // Transactions and messages will be signed with PrivateKey.
  },
  encryptWithPassword (password, val) {
    return cryptoUtils.encrypt(val, password);// + this.salt);
  },
  decryptWithPassword (password, val) {
    let res;
    try {
      res = cryptoUtils.decrypt(val, password);// + this.salt);
    } catch (err) {
      console.error('Wallet: was not able to decrypt a string')
    }
    return res;
  },
  reCryptKeys (oldPassword, newPassword) {
    if (!_keys) {
      return;
    }
    let decryptedMnemonic = this.decryptWithPassword(oldPassword, this.encryptedMnemonic);
    if (!decryptedMnemonic) {
      console.error('Cannot re-crypt keys. Decryption failed');
      return;
    }
    this.encryptedMnemonic = this.encryptWithPassword(newPassword, decryptedMnemonic);
    this.encryptedKey = this.encryptWithPassword(newPassword, _keys.root.toBase58());
  },

  /**
   * @function models/user.prototype.changePassword changePassword
   * @parent models/user.prototype
   * Updates user password.
   *
   * @signature `user.changePassword( password )`
   * @param {String} password User's plain password. Will be sent as hashed.
   */
  changePassword (password) {
    // Case: user forgot-password flow.
    if (this.encryptedKey && !_keys) {
      // this.loadWalletKeys();
      console.error('Need to restore keys using mnemonic!');
      return;
    }
    if (_keys) {
      this.reCryptKeys(_password, password);
    }

    _password = password;

    return userService.patch(this._id, {
      password: signed.createHash(password),
      encryptedMnemonic: this.encryptedMnemonic,
      encryptedKey: this.encryptedKey
    }).then(data => {
      this.salt = data.salt;
    });
  },
  updatePasswordCache (password) {
    _password = password;
  },

  /**
   * @property {Function} models/user.prototype.clearKeys clearKeys
   * @parent models/user.prototype
   * Clear keys stored in a closure.
   */
  clearKeys () {
    _keys = null;
    _password = null;
  },

  //! steal-remove-start
  _testGetCache () {
    return { _keys, _password };
  }
  //! steal-remove-end
});

User.List = DefineList.extend('UserList', {
  '#': User
});

// During signup server does not return us an id because we don't trust user at this stage
// so we ignore regular behaviors (real-time) in this case.
const ignoreUserNoIdBehavior = connect.behavior('user-ignore-no-id', function (baseConnection) {
  return {
    createInstance: function (data) {
      if (data._id) {
        return baseConnection.createInstance.apply(this, arguments);
      }
    }
  };
});

const feathersService = feathersClient.service('/users');

feathersService.hooks({
  before: {
    all: [
      signed.hooks.sign()
    ]
  }
});

User.connection = superModel({
  Map: User,
  List: User.List,
  feathersService,
  name: 'users',
  algebra
}, [ignoreUserNoIdBehavior]);

User.algebra = algebra;

export default User;
window.User = User;
