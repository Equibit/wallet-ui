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
    return this.user.isNew;
  },
  usingTempPassword: 'boolean'
});

export default Session;
