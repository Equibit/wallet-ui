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
