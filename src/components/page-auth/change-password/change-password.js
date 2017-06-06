/**
 * @module {can.Component} components/page-auth/change-password change-password
 * @parent components.auth
 *
 * Change password component
 *
 * @signature `<change-password {user}="user" />`
 *
 *  @param {models/user} user A reference to the [models/user] instance
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
import route from 'can-route';
import hub from '~/utils/event-hub';
import i18n from '~/i18n/';

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

    // Note: after changing password user is no longer new.
    const isNewUser = this.user.isNewUser;

    this.user.changePassword(password)
      .then(() => {
        if (isNewUser) {
          // TODO: enable back.
          // this.user.generateWalletKeys();
        } else {
          // this.user.loadWalletKeys();
        }
        this.routeWithAlert(isNewUser);
      })
      .catch(e => {
        console.error(e);
        this.generalError = JSON.stringify(e);
      });
  },
  togglePassword () {
    this.passwordVisible = !this.passwordVisible;
  },
  routeWithAlert (isNewUser) {
    route.data.page = 'portfolio';
    let title = isNewUser ? i18n.accountCreated : i18n.passwordReset;
    let msg = isNewUser ? i18n.welcomeMsg : i18n.passwordResetMsg;
    hub.dispatch({
      'type': 'alert',
      'kind': 'success',
      'title': title,
      'displayInterval': 5000,
      'message': msg
    });
  }
});

export default Component.extend({
  tag: 'change-password',
  ViewModel,
  view
});
