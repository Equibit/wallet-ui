/**
 * @module {can.Component} components/page-auth/change-password Change Password
 * @parent components.auth
 *
 * @link ../src/components/page-auth/change-password/change-password.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/change-password/change-password.html
 *
**/

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './change-password.less';
import view from './change-password.stache';
import validate from '~/utils/validators';
import route from 'can-route';import hub from '~/utils/event-hub';

export const ViewModel = DefineMap.extend({
  email: {
    type: 'string'
  },
  password: {
    type: 'string',
    set (value) {
      this.passwordError = validate.password(value, {allowEmpty: 1});
      return value;
    }
  },
  passwordVisible: {
    value: false
  },
  user: '*',

  // Form validation:
  passwordError: 'string',
  generalError: 'string',
  get isPasswordValid () {
    this.passwordError = validate.password(this.password, {allowEmpty: 0});
    return !this.passwordError;
  },

  // Methods:
  updatePassword (el) {
    this.password = el.value;
  },
  handlePasswordChange (event, password) {
    event.preventDefault();
    if (!this.isPasswordValid) {
      return false;
    }

    this.user.changePassword(password)
      .then(() => {
        route.data.page = 'portfolio';
        hub.dispatch({
          'type': 'alert',
          'kind': 'success',
          'title': 'Account Created',
          'displayInterval': 2000,
          'message': 'Welcome to Equibit! Your account was created successfully!'
        });
      })
      .catch(e => {
        console.error(e);
        this.generalError = JSON.stringify(e);
      });
  },
  togglePassword () {
    this.passwordVisible = !this.passwordVisible;
  }
});

export default Component.extend({
  tag: 'change-password',
  ViewModel,
  view
});
