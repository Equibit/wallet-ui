import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-auth.stache';
import feathersClient from '~/models/feathers-client-rest';
import signed from '~/models/feathers-signed';

export const ViewModel = DefineMap.extend({
  email: {
    value: 'marshall@creativeideal.net'
  },
  password: {
    value: 'test'
  },
  passwordVisible: {
    value: false
  },
  hashedPassword: 'string',
  isAccountCreated: {
    value: false
  },
  salt: 'string',
  challenge: 'string',
  secret: 'string', // The secret is used to sign requests.
  signature: 'string', // Remove this.  It's only here for verification / testing.
  handleSignup (event, email, password) {
    event.preventDefault();
    feathersClient.service('users').create({ email })
      .then(() => {
        this.isAccountCreated = true;
      });
  },
  handleLogin (event, email, password) {
    event.preventDefault();

    let hashedPassword = signed.createHash(password);
    let data = { email };

    signed.sign(data, hashedPassword)
      .then(signedData => {
        return feathersClient.authenticate({
          strategy: 'challenge-request',
          ...signedData
        });
      })
    .then(({challenge, salt}) => {
      this.challenge = challenge;
      this.salt = salt;
      signed.generateSecret(hashedPassword, salt).then(secret => {
        // The secret is the same as the stored password, but it
        // never gets sent across the wire.
        this.secret = secret;
        let data = {email, challenge};
        return signed.sign(data, secret);
      })
      .then(signedData => {
        signedData.strategy = 'challenge';
        this.signature = signedData.signature;
        return feathersClient.authenticate(signedData);
      })
      .then(response => {
        // debugger;
      })
      .catch(error => {
        console.log(error);
        // debugger;
      });
    })
    .catch(error => {
      console.log(error);
    });
  },
  hashPassword (password) {
    return password;
  },
  clear () {
    this.salt = '';
    this.challenge = '';
    this.secret = '';
    this.hashedPassword = '';
  },
  togglePassword () {
    this.passwordVisible = !this.passwordVisible;
  }
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  view
});
