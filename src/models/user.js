import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
//import feathersClient from './feathers-client';
import feathersClient from './feathers-client-rest';
import superModel from './super-model';
import algebra from './algebra';

var User = DefineMap.extend('User', {
  _id: 'string',
  email: 'string',
  password: 'string',
  usedTmpPassword: {
    type: 'boolean',
    value: false
  },
  isNewAccount: {
    type: 'boolean',
    value: false
  },
  generatePrivateKey(){
    // To generate Private Key we need to generate 12 words first.
  },
  signWithPrivateKey(){
    // Transactions and messages will be signed with PrivateKey.
  },
  encryptWithPassword(){
    // Private key and the 12 recovery words should be encrypted with user password.
  },
  decryptWithPassword(){
    // To sign anything with PrivateKey we need to decrypt it.
    // Also we want allow user to save his recovery phrase which also can be decrypted with pswd.
  }
});

User.List = DefineList.extend('UserList', {
  '#': User
});

User.connection = superModel({
  Map: User,
  List: User.List,
  feathersService: feathersClient.service('/users'),
  name: 'users',
  algebra
});

User.algebra = algebra;

export default User;
