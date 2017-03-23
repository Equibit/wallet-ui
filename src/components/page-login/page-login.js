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
      strategy: 'local',
      email,
      password
    });
  }
});

export default Component.extend({
  tag: 'page-login',
  ViewModel,
  view
});
