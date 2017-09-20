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

import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import set from 'can-set'
import dataParse from 'can-connect/data/parse/'
import construct from 'can-connect/constructor/'
import constructStore from 'can-connect/constructor/store/'
import constructOnce from 'can-connect/constructor/callbacks-once/'
import constructorHydrate from 'can-connect/can/constructor-hydrate/constructor-hydrate'
import canMap from 'can-connect/can/map/'
import dataCallbacks from 'can-connect/data/callbacks/'
import realtime from 'can-connect/real-time/'
import feathersAuthenticationSignedSession from 'feathers-authentication-signed/behavior'
import canDefineStream from 'can-define-stream-kefir'

import Notification from './notification'
import feathersClient from './feathers-client'
import signed from './feathers-signed'
import User from './user/user'
import Portfolio from './portfolio'
import Issuance from './issuance'

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
]

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
   * Promise for portfolios live list.
   */
  portfoliosPromise: {
    get () {
      console.log('[session.portfoliosPromise.get] ...')
      // TODO: report that portfolio.patch breaks Portfolio.connection.listStore if a set different from `{}` is used.
      // We do not need to provide userId since feathers does this for us (restricts to current user via JWT)
      return Portfolio.getList({})
    }
  },

  /**
   * @property {Function} models/session.prototype.portfoliosMeta portfoliosMeta
   * @parent models/session.prototype
   * List of user's portfolios info.
   * ```
   *  [{
   *    name,
   *    index,
   *
   *  }]
   * ```
   */
  portfolios: {
    Type: Portfolio.List,
    get (val, resolve) {
      console.log('[session.portfolios.get] ...')
      this.portfoliosPromise.then(portfolios => {
        portfolios.forEach(portfolio => {
          if (portfolio.index !== 'undefined') {
            portfolio.keys = this.user.generatePortfolioKeys(portfolio.index)
          }
        })
        console.log('[session.portfolios.get -> resolve] length=' + portfolios.length)
        resolve(portfolios)
      })
    }
  },

  /**
   * @property {Function} models/session.prototype.refreshBalance refreshBalance
   * @parent models/session.prototype
   * Method to refresh balance. Will request linstunspent and update balancePromise.
   */
  refreshBalance: function () {
    this.dispatch('refresh')
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
    get () {
      if (!this.utxoByTypeByAddress) {
        return {
          summary: { cash: 0, securities: 0, total: 0 }
        }
      }
      if ((!val || val.isDefault) && this.balancePromise) {
        this.balancePromise.then(balance => {
          this.portfolios.forEach(portfolio => {
            // TODO: Mutates portfolio updating userBalance. Use getter that checks Session.current.balance
            console.log('[portfolio.balance] updating portfolio.userBalance ...')
            portfolio.userBalance = balance
          })
          balance.summary = {
            securities: 0,
            cash: balance.BTC.summary.total + (balance.EQB.summary.total) * this.rates.eqbToBtc
          }
          balance.summary.total = balance.summary.securities + balance.summary.cash
          resolve(balance)
        })
      }
      return val
    }
  },

  usingTempPassword: 'boolean',
  accessToken: 'string',
  secret: 'string',
  get email () {
    return this.user && this.user.email
  },
  get isNewAccount () {
    return this.user && this.user.isNewUser
  },

  // TODO: add local currency switch support.
  rates: {
    get () {
      return (this.user && this.user.rates) || Session.defaultRates
    }
  },

  // TODO: use BTC switch here (uBTC / mBTC / BTC).
  toBTC (amount, currencyType) {
    return currencyType === 'EQB' ? amount * this.rates.eqbToBtc : amount
  },

  notifications: {
    Type: Notification.List,
    value: new Notification.List([])
  },

  issuancesPromise: {
    get () {
      return this.user && Issuance.getList({userId: this.user._id})
    }
  },
  issuances: {
    get (val, resolve) {
      if (this.issuancesPromise) {
        this.issuancesPromise.then(resolve)
      }
      return val
    }
  }
})

Session.defaultRates = {
  btcToUsd: 5000,
  eqbToUsd: 100,
  eqbToBtc: 100 / 5000
}

canDefineStream(Session)

const algebra = new set.Algebra(
  set.comparators.id('accessToken')
)

Session.List = DefineList.extend('SessionList', {
  '#': Session
})

Session.connection = connect(behaviors, {
  feathersClient,
  Map: Session,
  List: Session.List,
  utils: signed,
  algebra
})

Session.algebra = algebra

//! steal-remove-start
window.Session = Session
//! steal-remove-end

export default Session
