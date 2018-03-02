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

  /**
   * @property {Boolean} models/user.properties.hasRecordedMnemonic hasRecordedMnemonic
   * @parent models/user.properties
   * Indicates whether the user has written down and verified the recovery phrase.
   */
  hasRecordedMnemonic: 'boolean',

  /**
   * @property {String} models/user.properties.salt salt
   * @parent models/user.properties
   * The initialization salt for encrypting the password and keys
   */
  salt: 'string',

  /**
   * @property {String} models/user.properties.provisionalSalt provisionalSalt
   * @parent models/user.properties
   * A newly generated salt to be used when changing the password (allows the keys
   * to be encrypted at the same time the password is changed)
   */
  provisionalSalt: 'string',

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
   * @property {Date} models/user.properties.passwordCreatedAt passwordCreatedAt
   * @parent models/user.properties
   * Date of last password change.
   */
  passwordCreatedAt: 'date',

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

  fiatCurrency: {
    type: 'string',
    serialize: false,
    value: function () {
      // TODO this needs to become part of the user preferences
      return 'USD'
    }
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
  encrypt (val) {
    return this.encryptWithPassword(_password, val)
  },
  decrypt (val) {
    return this.decryptWithPassword(_password, val)
  },
  reCryptKeys (oldPassword, newPassword, newSalt) {
    if (!_keys) {
      return
    }
    let decryptedMnemonic = this.decryptWithPassword(oldPassword, this.encryptedMnemonic)
    if (!decryptedMnemonic) {
      console.error('Cannot re-crypt keys. Decryption failed')
      return
    }
    const _salt = this.salt
    if (newSalt) {
      this.salt = newSalt
    }
    this.encryptedMnemonic = this.encryptWithPassword(newPassword, decryptedMnemonic)
    this.encryptedKey = this.encryptWithPassword(newPassword, _keys.root.toBase58())
    this.salt = _salt
  },

  /**
   * @function models/user.prototype.changePassword changePassword
   * @parent models/user.prototype
   * Updates user password and recrypts keys
   *
   * @signature `user.changePassword( password )`
   * @param {String} password User's plain password. Will be sent as hashed.
   */
  changePassword (password, oldPassword) {
    const _encryptedMnemonic = this.encryptedMnemonic
    const _encryptedKey = this.encryptedKey
    const _salt = this.salt
    const hashedPassword = signed.createHash(password)
    const paramsStep2 = {
      password: hashedPassword,
      salt: this.salt
    }
    const paramsStep1 = {
      requestPasswordChange: true
    }
    let step1Promise
    if (this.provisionalSalt) {
      // In the case where provisionalSalt exists, we've already requested one.
      step1Promise = Promise.resolve({ provisionalSalt: this.provisionalSalt })
    } else if (arguments.length > 1) {
      // In the case where there is an "old" password, we assume that the
      //  current password is *not* a temp password.
      //  Let empty passwords through, though, to receive the appropriate API error.
      paramsStep1.oldPassword = signed.createHash(oldPassword)
      step1Promise = userService.patch(this._id, paramsStep1)
    } else {
      // Otherwise the current password is temp and we can skip requesting a
      // provisional salt, because the salt will not change
      step1Promise = Promise.resolve({ provisionalSalt: this.salt })
    }

    return step1Promise.then(user => {
      Object.assign(this, user)
      paramsStep2.salt = user.provisionalSalt
      // Case: user is already logged in, keys were loaded, need to re-crypt keys.
      // Otherwise: user is new or forgot his password (in which case `generateWalletKeys` should be used).
      if (_keys) {
        this.reCryptKeys(_password, password, user.provisionalSalt)
        paramsStep2.encryptedMnemonic = this.encryptedMnemonic
        paramsStep2.encryptedKey = this.encryptedKey
      }

      return userService.patch(this._id, paramsStep2).then(data => {
        Object.assign(this, data)
        _password = password
        return data
      }, error => {
        // In case of patch failure, restore old mnemonic and key
        this.encryptedMnemonic = _encryptedMnemonic
        this.encryptedKey = _encryptedKey
        this.salt = _salt
        if (error.errors && error.errors.provisionalSalt) {
          // A provisionalSalt error means that the provisional salt is not available
          //  and we shouldn't keep it here
          this.provisionalSalt = undefined
        }
        throw error
      })
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
