import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './change-password.scss';
import view from './change-password.stache';
import feathersClient from '~/models/feathers-client-rest';
import signed from '~/models/feathers-signed';

export const ViewModel = DefineMap.extend({
  email: {
    value: '',
    type: 'string'
  },
  password: {
    value: '',
    type: 'string'
  },
  passwordVisible: {
    value: false
  },
  updatePassword (el) {
    this.password = el.value;
  },
  handlePasswordChange (event, email, password) {
    event.preventDefault();
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
