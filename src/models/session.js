/* global window */
import DefineMap from 'can-define/map/';
import User from '~/models/user';

export const Session = DefineMap.extend('Session', {
  user: {
    Type: User
  },
  get email () {
    return this.user.email;
  },
  get isNewAccount () {
    return this.user.isNewAccount;
  },
  get usedTmpPassword () {
    return this.user.usedTmpPassword;
  }
});

export default Session;
