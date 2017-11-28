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

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from '../feathers-client'
import signed from '../feathers-signed'
import superModel from '../super-model'
import algebra from '../algebra'
import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'
import cryptoUtils from '../../utils/crypto'
import connect from 'can-connect'
import login from './login'
// import Portfolio from '../portfolio';

const userService = feathersClient.service('users')

let _password
let _keys
const _network = bitcoin.networks.testnet

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
    return feathersClient.service('users').create({ email })
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
    return feathersClient.service('forgot-password').create({email})
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
   * @property {Boolean} models/user.properties.twoFactorValidatedSession twoFactorValidatedSession
   * @parent models/user.properties
   * Whether the user has used 2FA to validate accounts this session
   */
  twoFactorValidatedSession: { type: 'boolean', default: false },

  /**
   * @property {Boolean} models/user.properties.emailVerified emailVerified
   * @parent models/user.properties
   * Whether the user has a verified email address
   */
  emailVerified: { type: 'boolean', default: false },

  /**
   * @property {Date} models/user.properties.isNewUser isRecovered
   * @parent models/user.properties
   * Indicates whether user keys were recovered from a seed.
   */
  isRecovered: {
    type: 'boolean',
    serialize: false
  },

  /**
   * @function models/user.prototype.generateWalletKeys generateWalletKeys
   * @parent models/user.prototype
   * Generates keys from a seed.
   */
  // Q: do we want different passphrases for mnemonic and privateKey? A: Not now.
  generateWalletKeys (mnemonic = bip39.generateMnemonic()) {
    const seed = bip39.mnemonicToSeed(mnemonic, '')
    const root = bitcoin.HDNode.fromSeedBuffer(seed, _network)

    this.encryptedMnemonic = this.encryptWithPassword(_password, mnemonic)
    this.encryptedKey = this.encryptWithPassword(_password, root.toBase58())

    return userService.patch(this._id, {
      encryptedMnemonic: this.encryptedMnemonic,
      encryptedKey: this.encryptedKey
    }).then(() => this.cacheWalletKeys(root))
  },

  /**
   * @function models/user.prototype.generateWalletKeys generateWalletKeys
   * @parent models/user.prototype
   * Cache BTC and EQB keys in a closure.
   */
  cacheWalletKeys (root) {
    const keyPairBTC = root.derivePath("m/44'/0'")
    const keyPairEQB = root.derivePath("m/44'/73'")

    _keys = {
      root: root,
      BTC: keyPairBTC,
      EQB: keyPairEQB
    }
    return this
  },

  /**
   * @function models/user.prototype.loadWalletKeys loadWalletKeys
   * @parent models/user.prototype
   * Generate HD node and wallet keys from the encrypted master key.
   */
  loadWalletKeys () {
    const base58Key = this.decryptWithPassword(_password, this.encryptedKey)
    const root = bitcoin.HDNode.fromBase58(base58Key, _network)
    this.cacheWalletKeys(root)
  },

  /**
   * @function models/user.prototype.generatePortfolioKeys generatePortfolioKeys
   * @parent models/user.prototype
   * Generates keys for a new Portfolio.
   */
  generatePortfolioKeys (index) {
    if (!_keys || !_keys.BTC || !_keys.EQB) {
      console.warn('No keys exist. Cannot generate portfolio keys')
      return
    }
    console.log(`generatePortfolioKeys(${index}) ...`)
    // TODO: we need to separate index for btc and eqb. E.g. companies have only eqb index for auth issuances.
    return {
      BTC: _keys.BTC.deriveHardened(index),
      EQB: _keys.EQB.deriveHardened(index)
    }
  },
  signWithPrivateKey () {
    // Transactions and messages will be signed with PrivateKey.
  },
  encryptWithPassword (password, val) {
    return cryptoUtils.encrypt(val, password + this.salt)
  },
  decryptWithPassword (password, val) {
    let res
    try {
      res = cryptoUtils.decrypt(val, password + this.salt)
    } catch (err) {
      console.error('Wallet: was not able to decrypt a string')
    }
    return res
  },
  reCryptKeys (oldPassword, newPassword) {
    if (!_keys) {
      return
    }
    let decryptedMnemonic = this.decryptWithPassword(oldPassword, this.encryptedMnemonic)
    if (!decryptedMnemonic) {
      console.error('Cannot re-crypt keys. Decryption failed')
      return
    }
    this.encryptedMnemonic = this.encryptWithPassword(newPassword, decryptedMnemonic)
    this.encryptedKey = this.encryptWithPassword(newPassword, _keys.root.toBase58())
  },

  /**
   * @function models/user.prototype.changePassword changePassword
   * @parent models/user.prototype
   * Updates user password and recrypts keys
   *
   * @signature `user.changePassword( password )`
   * @param {String} password User's plain password. Will be sent as hashed.
   */
  changePassword (password) {
    const hashedPassword = signed.createHash(password)
    const params = {
      password: hashedPassword
    }

    // Case: user is already logged in, keys were loaded, need to re-crypt keys.
    // Otherwise: user is new or forgot his password (in which case `generateWalletKeys` should be used).
    if (_keys) {
      this.reCryptKeys(_password, password)
      params.encryptedMnemonic = this.encryptedMnemonic
      params.encryptedKey = this.encryptedKey
    }

    _password = password

    return userService.patch(this._id, params).then(data => {
      this.salt = data.salt
    })
  },

  /**
   * @function models/user.prototype.clearKeys clearKeys
   * @parent models/user.prototype
   * Clear keys stored in a closure.
   */
  clearKeys () {
    _keys = null
    _password = null
  },

  updatePasswordCache (password) {
    _password = password
  },

  //! steal-remove-start
  _testGetCache () {
    return { _keys, _password }
  }
  //! steal-remove-end
})

User.List = DefineList.extend('UserList', {
  '#': User
})

// During signup server does not return us an id because we don't trust user at this stage
// so we ignore regular behaviors (real-time) in this case.
const ignoreUserNoIdBehavior = connect.behavior('user-ignore-no-id', function (baseConnection) {
  return {
    createInstance: function (data) {
      if (data._id) {
        return baseConnection.createInstance.apply(this, arguments)
      }
    }
  }
})

const feathersService = feathersClient.service('/users')

feathersService.hooks({
  before: {
    all: [
      signed.hooks.sign()
    ]
  }
})

User.connection = superModel({
  Map: User,
  List: User.List,
  feathersService,
  name: 'users',
  algebra
}, [ignoreUserNoIdBehavior])

User.algebra = algebra

export default User

if (typeof window !== 'undefined') {
  window.User = User
}
