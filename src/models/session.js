/**
 * @module {can-map} models/session Session
 * @parent models
 *
 * Session model
 *
 * Session is implemented using `feathers-authentication-signed` connection behavior and provides
 * property `current` that should be use to access current user session.
 *
 * `Session.current` contains three main objects: user, a list of user's portfolios and balance.
 *
 * @group models/session.properties 0 properties
 */

import connect from 'can-connect';
import set from 'can-set';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import constructorHydrate from 'can-connect/can/constructor-hydrate/constructor-hydrate';
import canMap from 'can-connect/can/map/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';
import feathersAuthenticationSignedSession from 'feathers-authentication-signed/behavior';

import feathersClient from '~/models/feathers-client';
import signed from '~/models/feathers-signed';

import DefineMap from 'can-define/map/';
import User from '~/models/user/user';
import Portfolio from '~/models/portfolio';

const behaviors = [
  feathersAuthenticationSignedSession,
  dataParse,
  construct,
  constructStore,
  constructOnce,
  canMap,
  constructorHydrate,
  dataCallbacks,
  realtime
];

const Session = DefineMap.extend('Session', {
  user: {
    Type: User,
    set (user) {
      if (user) {
        // Load user's portfolios and generate keys for each one of them:
        Portfolio.getList({$limit: 5, $skip: 0}).then(portfolios => {
          portfolios.forEach(portfolio => {
            if (portfolio.index !== 'undefined') {
              portfolio.keys = user.generatePortfolioKeys(portfolio.index);
            }
          });
          this.portfolios = portfolios;
        });
      }
      return user;
    }
  },
  portfolios: {
    Type: Portfolio.List,
    set (val) {
      if (val && val.length) {
        // Request unspent balance for all addresses:
        const addresses = val.reduce((acc, portfolio) => {
          return acc.concat(portfolio.addressesFilled.get());
        }, []);
        if (addresses && addresses.length) {
          feathersClient.service('/listunspent').find({
            query: {addr: addresses}
          }).then(data => {
            // TODO: populate each portfolio balance here.
            this.balance = data;
          });
        }
      }
      return val;
    }
  },
  /**
   * User balance contains a summary and balance per address.
   * ```
   * {
   *   "summary": {
   *     "total": 3.34999
   *   },
   *   "mpS2RuNkAEALvMhksCa6fPpLVb5yCPanLu": {
   *     "amount": 2.35,
   *     "txouts": [...]
   *   }, { ... }
   * }
   * ```
   */
  balance: {
    Type: DefineMap
  },
  usingTempPassword: 'boolean',
  accessToken: 'string',
  secret: 'string',
  get email () {
    return this.user && this.user.email;
  },
  get isNewAccount () {
    return this.user && this.user.isNewUser;
  }
});

const algebra = new set.Algebra(
  set.comparators.id('accessToken')
);

Session.connection = connect(behaviors, {
  feathersClient,
  Map: Session,
  utils: signed,
  algebra
});

Session.algebra = algebra;

//! steal-remove-start
window.Session = Session;
//! steal-remove-end

export default Session;
