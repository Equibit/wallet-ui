import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './forgot-password.less';
import view from './forgot-password.stache';
import User from '~/models/user';
import validate from '~/utils/validators';

export const ViewModel = DefineMap.extend({
  email: {
    type: 'string',
    set (value) {
      this.emailError = validate.email(value, {allowEmpty: 1});
      return value;
    }
  },
  isDone: 'boolean',
  emailError: 'string',

  get isEmailValid () {
    this.emailError = validate.email(this.email, {allowEmpty: 0});
    return !this.emailError;
  },

  // Methods:
  handleSubmit (event, email) {
    event.preventDefault();
    if (!this.isEmailValid) {
      return false;
    }
    User.forgotPassword(email)
      .then(() => {
        this.isDone = true;
      });
  },
});

export default Component.extend({
  tag: 'forgot-password',
  ViewModel,
  view
});
