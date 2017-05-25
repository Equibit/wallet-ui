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
import crypto from '~/utils/crypto';
import connect from 'can-connect';
import login from './login';

const userService = feathersClient.service('users');

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

  /**
   * @property {String} models/user.properties.email email
   * @parent models/user.properties
   * Password of a user. Is stored as hashed on the server. Is sent to the server only when set or updated, never during login.
   */
  password: 'string',

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
   * @property {Function} models/user.prototype.generateKeys generateKeys
   * @parent models/user.prototype
   * Generates user keys.
   */
  // Q: do we want different passphrases for mnemonic and privateKey? A: Not now.
  generateKeys () {
    let mnemonic = crypto.generateMnemonic();
    let privateKey = crypto.mnemonicToPrivateKey(mnemonic);
    let publicKey = crypto.getPublicKey(privateKey);
    return {
      mnemonic,
      privateKey,
      publicKey
    };
  },
  signWithPrivateKey () {
    // Transactions and messages will be signed with PrivateKey.
  },
  encryptWithPassword () {
    // Private key and the 12 recovery words should be encrypted with user password.
  },
  decryptWithPassword () {
    // To sign anything with PrivateKey we need to decrypt it.
    // Also we want allow user to save his recovery phrase which also can be decrypted with pswd.
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
    // TODO: do not attach password to the user, store it in a closure.
    this.password = password;
    password = signed.createHash(password);
    return userService.patch(this._id, { password });
  }
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
      signed.sign()
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
