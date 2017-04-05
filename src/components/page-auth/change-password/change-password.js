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
import feathersClient from '~/models/feathers-client-rest';
import signed from '~/models/feathers-signed';
import validate from '~/utils/validators';

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

  // Form validation:
  passwordError: 'string',
  get isPasswordValid () {
    this.passwordError = validate.password(this.password, {allowEmpty: 0});
    return !this.passwordError;
  },

  // Methods:
  updatePassword (el) {
    this.password = el.value;
  },
  handlePasswordChange (event, email, password) {
    event.preventDefault();
    if (!this.isPasswordValid) {
      return false;
    }

    let userService = feathersClient.service('users');
    let idField = '_id';

    password = signed.createHash(password);

    userService.find({email})
      .then(users => {
        users = users.data || users;
        let user = users[0];
        if (user) {
          userService.patch(user[idField], {password});
        } else {
          throw new Error(`User ${email} not found.`);
        }
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
