/**
 *
 * @module {can.Component} components/page-auth Page Authentication
 * @parent components.auth
 *
 * @link ../src/components/page-auth/page-auth.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/page-auth.html
 *
**/

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-auth.stache';
import Session from '~/models/session';
import User from '~/models/user/user';
import validate from '~/utils/validators';
import route from 'can-route';
import signupTpl from './signup.stache';
import loginTpl from './login.stache';

export const ViewModel = DefineMap.extend({
  signupTpl,
  loginTpl,

  email: {
    type: 'string',
    set (value) {
      this.emailError = validate.email(value, {allowEmpty: 1});
      return value;
    }
  },
  password: {
    type: 'string',
    set (value) {
      this.passwordError = validate.password(value, {allowEmpty: 1});
      return value;
    }
  },
  session: {
    type: 'any'
  },
  /**
   * @property {boolean}
   * Toggles the password input visibility (password vs text type).
   */
  passwordVisible: {
    value: false
  },
  agreedToTerms: {
    type: 'boolean',
    set (value) {
      this.termsError = '';
      return value;
    }
  },
  hashedPassword: 'string',
  isAccountCreated: {
    value: false
  },

  // Form validation:
  emailError: 'string',
  passwordError: 'string',
  termsError: 'string',
  get isSignupValid () {
    this.emailError = validate.email(this.email, {allowEmpty: 0});
    this.termsError = validate.terms(this.agreedToTerms);
    return !this.emailError && !this.termsError;
  },
  get isLoginValid () {
    this.emailError = validate.email(this.email, {allowEmpty: 0});
    this.passwordError = validate.password(this.password, {allowEmpty: 0});
    return !this.emailError && !this.passwordError;
  },

  // Methods:
  handleSignup (event, email, password) {
    event.preventDefault();
    if (!this.isSignupValid) {
      return false;
    }
    User.signup(email)
      .then(() => {
        this.isAccountCreated = true;
      });
  },
  handleLogin (event, email, password) {
    event.preventDefault();
    if (!this.isLoginValid) {
      return false;
    }

    User.login(email, password)
    .then(({ usingTempPassword, user }) => {
      this.session = new Session({ usingTempPassword, user });
      route.data.page = usingTempPassword ? 'change-password' : 'portfolio';
    })
    .catch(error => {
      console.log(error);
    });
  },
  togglePassword () {
    this.passwordVisible = !this.passwordVisible;
  },
  clearAccountCreated () {
    this.password = '';
    this.isAccountCreated = false;
  }
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  view
});
