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
import feathersClient from '~/models/feathers-client-rest';
import signed from '~/models/feathers-signed';
import validate from '~/utils/validators';

// To persist user email when a new account is created under SignUp and user goes to Login.
let newUserEmail = '';

export const ViewModel = DefineMap.extend({
  email: {
    type: 'string',
    value () {
      return newUserEmail;
    },
    set (value) {
      newUserEmail = '';
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
  salt: 'string',
  challenge: 'string',
  secret: 'string', // The secret is used to sign requests.
  signature: 'string', // Remove this.  It's only here for verification / testing.

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
    feathersClient.service('users').create({ email })
      .then(() => {
        this.isAccountCreated = true;
        newUserEmail = email;
      });
  },
  handleLogin (event, email, password) {
    event.preventDefault();
    if (!this.isLoginValid) {
      return false;
    }

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
