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
  /**
   * @property {Function} models/session.prototype.user user
   * @parent models/session.prototype
   * User instance.
   */
  user: {
    Type: User
  },

  /**
   * @property {Function} models/session.prototype.portfoliosPromise portfoliosPromise
   * @parent models/session.prototype
   * Promise for portfolios.
   */
  portfoliosPromise: {
    get () {
      return Portfolio.getList({$limit: 5, $skip: 0});
    }
  },

  /**
   * @property {Function} models/session.prototype.portfolios portfolios
   * @parent models/session.prototype
   * List of user's portfolios.
   */
  portfolios: {
    Type: Portfolio.List,
    get (val, resolved) {
      if (!val) {
        this.portfoliosPromise.then(portfolios => {
          portfolios.forEach(portfolio => {
            if (portfolio.index !== 'undefined') {
              portfolio.keys = this.user.generatePortfolioKeys(portfolio.index);
            }
          });
          resolved(portfolios);
        });
      }
      return val;
    }
  },

  /**
   * @property {Function} models/session.prototype.allAddresses allAddresses
   * @parent models/session.prototype
   * List of all addresses for fetching unspent amounts.
   */
  allAddresses: {
    get () {
      return this.portfolios && this.portfolios.reduce((acc, portfolio) => {
        return {
          btc: acc.btc.concat(portfolio.addressesBtc),
          eqb: acc.eqb.concat(portfolio.addressesEqb)
        };
      }, {eqb: [], btc: []});
    }
  },

  /**
   * @property {Function} models/session.prototype.balancePromise balancePromise
   * @parent models/session.prototype
   * Promise for balance.
   */
  balancePromise: {
    get () {
      const hasAddr = this.allAddresses && (this.allAddresses.btc.length || this.allAddresses.eqb.length);
      return hasAddr && feathersClient.service('/listunspent').find({
        query: {
          btc: this.allAddresses.btc,
          eqb: this.allAddresses.eqb,
          byaddress: true
        }
      });
    }
  },

  /**
   * @property {Function} models/session.prototype.balance balance
   * @parent models/session.prototype
   * User balance contains a summary and balance per address.
   *
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
    // 1. We pass user's balance to each portfolio
    // 2. Each portfolio calculates its own balance and break it down (equity / bonds / cash)
    // 3. We calculate summary based on individual portfolio balance and add it to user's balance.
    get (val, resolve) {
      if (!val && !this.balancePromise) {
        return {
          summary: { cash: 0, securities: 0, total: 0, isDefault: true }
        };
      }
      if (val && val.isDefault && this.balancePromise) {
        this.balancePromise.then(balance => {
          this.portfolios.forEach(portfolio => {
            portfolio.userBalance = balance;
          });
          balance.summary = {
            securities: 0,
            cash: balance.btc.summary.total + balance.eqb.summary.total
          };
          balance.summary.total = balance.summary.securities + balance.summary.cash;
          resolve(balance);
        });
      }
      return val;
    }
  },

  usingTempPassword: 'boolean',
  accessToken: 'string',
  secret: 'string',
  get email () {
    return this.user && this.user.email;
  },
  get isNewAccount () {
    return this.user && this.user.isNewUser;
  },
  get rates () {
    return (this.user && this.user.rates) || {
      btcToUsd: 2725,
      eqbToUsd: 3
    };
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
