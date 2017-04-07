/**
 * @module {can.Component} components/page-auth/sign-up Signup
 * @parent components.auth
 *
 * @link ../src/components/page-auth/sign-up/sign-up.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/sign-up/sign-up.html
 *
**/

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './sign-up.less';
import view from './sign-up.stache';
import User from '~/models/user/user';
import validate from '~/utils/validators';

export const ViewModel = DefineMap.extend({
  email: {
    type: 'string',
    set (value) {
      this.emailError = validate.email(value, {allowEmpty: 1});
      return value;
    }
  },
  agreedToTerms: {
    type: 'boolean',
    set (value) {
      this.termsError = '';
      return value;
    }
  },
  isAccountCreated: 'boolean',

  // Error validation:
  signupError: 'boolean',
  emailError: 'string',
  passwordError: 'string',
  termsError: 'string',
  get isSignupValid () {
    this.emailError = validate.email(this.email, {allowEmpty: 0});
    this.termsError = validate.terms(this.agreedToTerms);
    return !this.emailError && !this.termsError;
  },

  // Methods:
  handleSignup (event, email) {
    this.signupError = false;
    event.preventDefault();
    if (!this.isSignupValid) {
      return false;
    }
    User.signup(email)
      .then(() => {
        this.isAccountCreated = true;
      })
      .catch(e => {
        console.error(e);
        this.signupError = true;
      });
  },
  clearAccountCreated () {
    this.isAccountCreated = false;
  }
});

export default Component.extend({
  tag: 'sign-up',
  ViewModel,
  view
});
