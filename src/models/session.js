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

import feathersClient from '~/models/feathers-client'
import signed from '~/models/feathers-signed'

import DefineMap from 'can-define/map/'
import User from '~/models/user/user'
import Portfolio from '~/models/portfolio'
import Issuance from '../models/issuance'

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
   * Promise for portfolios.
   */
  portfoliosPromise: {
    get () {
      console.log('[session.portfoliosPromise.get] ...')
      return Portfolio.getList({$limit: 5, $skip: 0})
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
      console.log('[session.portfolios.get] ...')
      if (!val) {
        this.portfoliosPromise.then(portfolios => {
          portfolios.forEach(portfolio => {
            if (portfolio.index !== 'undefined') {
              // TODO: Mutates portfolio adding keys. Use getter that checks Session.current.user and generates keys.
              portfolio.keys = this.user.generatePortfolioKeys(portfolio.index)
            }
          })
          console.log('[session.portfolios.get -> resolve] length=' + portfolios.length)
          resolved(portfolios)
        })
      }
      return val
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
          BTC: acc.BTC.concat(portfolio.addressesBtc),
          EQB: acc.EQB.concat(portfolio.addressesEqb)
        }
      }, {EQB: [], BTC: []})
    }
  },

  /**
   * @property {Function} models/session.prototype.balancePromise balancePromise
   * @parent models/session.prototype
   * Promise for balance.
   */
  balancePromise: {
    stream: function () {
      const addrStream = this.toStream('.allAddresses').skipWhile(a => !a || !(a.BTC.length || a.EQB.length))
      return addrStream.merge(this.toStream('refresh')).map(() => {
        console.log('*** [portfolio.balancePromise] fetching balance...')
        return this.fetchBalance()
      })
    }
  },
  fetchBalance () {
    const addr = this.allAddresses
    return feathersClient.service('/listunspent').find({
      // GET query params are lower cased:
      query: {
        btc: addr.BTC,
        eqb: addr.EQB,
        byaddress: true
      }
    })
  },
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
    get (val, resolve) {
      if (!val && !this.balancePromise) {
        return {
          summary: { cash: 0, securities: 0, total: 0, isDefault: true }
        }
      }
      // TODO: fix incorrect using val which only receives a value when balance gets explicitly set.
      if ((!val || val.isDefault) && this.balancePromise) {
        this.balancePromise.then(balance => {
          this.portfolios.forEach(portfolio => {
            // TODO: Mutates portfolio updating userBalance. Use getter that checks Session.current.balance
            console.log('[portfolio.balance] updating portfolio.userBalance ...')
            portfolio.userBalance = balance
          })
          balance.summary = {
            securities: 0,
            cash: balance.BTC.summary.total + balance.EQB.summary.total
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
  get rates () {
    return (this.user && this.user.rates) || {
      btcToUsd: 2725,
      eqbToUsd: 3,
      eqbToBtc: 3 / 2725
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

canDefineStream(Session)

const algebra = new set.Algebra(
  set.comparators.id('accessToken')
)

Session.connection = connect(behaviors, {
  feathersClient,
  Map: Session,
  utils: signed,
  algebra
})

Session.algebra = algebra

//! steal-remove-start
window.Session = Session
//! steal-remove-end

export default Session
