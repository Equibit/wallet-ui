import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-login.stache';
import feathersClient from '~/models/feathers-client';

export const ViewModel = DefineMap.extend({
  email: {
    value: ''
  },
  password: {
    value: ''
  },
  handleSubmit (event, email, password) {
    event.preventDefault();
    feathersClient.authenticate({
      strategy: 'challenge-request',
      email,
      password
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
  tag: 'page-login',
  ViewModel,
  view
});
