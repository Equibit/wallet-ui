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
  // static methods:
  login,
  signup (email) {
    return feathersClient.service('users').create({ email });
  },
  forgotPassword (email) {
    return feathersClient.service('forgot-password').create({email});
  }
}, {
  _id: 'string',
  email: 'string',
  password: 'string',
  isNewUser: 'boolean',
  createdAt: 'date',
  updatedAt: 'date',
  // Q: do we want different passphrases for mnemonic and privateKey? A: Not now.
  generateKeys (password) {
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
  changePassword (password) {
    // TODO: do not attache password to the user, store it in a closure.
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

User.connection = superModel({
  Map: User,
  List: User.List,
  feathersService: feathersClient.service('/users'),
  name: 'users',
  algebra
}, [ignoreUserNoIdBehavior]);

User.algebra = algebra;

export default User;
