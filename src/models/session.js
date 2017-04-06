/* global window */
import DefineMap from 'can-define/map/';
import User from '~/models/user';

export const Session = DefineMap.extend('Session', {
  user: {
    Type: User
  },
  usingTempPassword: 'boolean',
  get email () {
    return this.user && this.user.email;
  },
  get isNewAccount () {
    return this.user && this.user.isNewUser;
  }
});

export default Session;
