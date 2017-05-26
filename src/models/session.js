import connect from 'can-connect';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';
import feathersAuthenticationSignedSession from 'feathers-authentication-signed/behavior';

import feathersClient from '~/models/feathers-client';
import signed from '~/models/feathers-signed';

import DefineMap from 'can-define/map/';
import User from '~/models/user/user';

const behaviors = [
  feathersAuthenticationSignedSession,
  dataParse,
  construct,
  constructStore,
  constructOnce,
  canMap,
  canRef,
  dataCallbacks,
  realtime
];

const Session = DefineMap.extend('Session', {
  user: {
    Type: User
  },
  usingTempPassword: 'boolean',
  secret: 'string',
  get email () {
    return this.user && this.user.email;
  },
  get isNewAccount () {
    return this.user && this.user.isNewUser;
  }
});

Session.connection = connect(behaviors, {
  feathersClient,
  Map: Session,
  utils: signed
});

export default Session;
