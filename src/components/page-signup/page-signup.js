import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-signup.stache';
import feathersClient from '~/models/feathers-client-rest';

export const ViewModel = DefineMap.extend({
  email: {
    value: ''
  },
  password: {
    value: ''
  },
  handleSubmit (event, email, password) {
    event.preventDefault();
    feathersClient.service('users').create({
      email,
      password
    });
  }
});

export default Component.extend({
  tag: 'page-signup',
  ViewModel,
  view
});
