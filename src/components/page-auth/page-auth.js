import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-auth.stache';
import feathersClient from '~/models/feathers-client-rest';

export const ViewModel = DefineMap.extend({
  email: {
    value: ''
  },
  password: {
    value: ''
  },
  isAccountCreated: {
    value: false
  },
  handleSignup (event, email, password) {
    event.preventDefault();
    feathersClient.service('users').create({
      email,
      password
    }).then(() => {
      this.isAccountCreated = true;
    });
  },
  handleLogin (event, email, password) {
    event.preventDefault();
    feathersClient.authenticate({
      strategy: 'challenge-request',
      email
    })
    .then(response => {
      Object.assign(this, response);
      // If its a new account we want to generate 12 words of the recovery phrase and a Private Key.
      // Both 12 words and PK will be encrypted with a password and saved as user data in DB.
    })
    .catch(error => {
      console.log(error);
    });
  },
  salt: 'string',
  challenge: 'string',
  clear () {
    this.salt = '';
    this.challenge = '';
  }
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  view
});
