import Component from 'can-component';
import DefineMap from 'can-define/map/';
import feathersClient from '~/models/feathers-client';
import signed from '~/models/feathers-signed';
import validate from '~/utils/validators';
import './reset-password.less';
import view from './reset-password.stache';

export const ViewModel = DefineMap.extend({
  // TODO: create session and use user info from there.
  email: 'string',
  password: {
    type: 'string',
    set (value) {
      this.passwordError = validate.password(value, {allowEmpty: 1});
      return value;
    }
  },
  passwordVisible: 'boolean',
  isDone: 'boolean',

  // Form validation:
  passwordError: 'string',
  get isPasswordValid () {
    this.passwordError = validate.password(this.password, {allowEmpty: 0});
    return !this.passwordError;
  },

  // Methods:
  handleSubmit (event, email, password) {
    event.preventDefault();
    if (!this.isPasswordValid) {
      return false;
    }

    // TODO: create session and use user info from there.
    let userService = feathersClient.service('users');
    let idField = '_id';

    let hashedPassword = signed.createHash(password);

    userService.find({email})
      .then(users => {
        users = users.data || users;
        let user = users[0];
        if (user) {
          userService.patch(user[idField], {password: hashedPassword});
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
  tag: 'forgot-password',
  ViewModel,
  view
});
