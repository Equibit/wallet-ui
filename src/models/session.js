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

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import set from 'can-set'
import dataParse from 'can-connect/data/parse/parse'
import construct from 'can-connect/constructor/constructor'
import constructStore from 'can-connect/constructor/store/store'
import constructOnce from 'can-connect/constructor/callbacks-once/callbacks-once'
import constructorHydrate from 'can-connect/can/constructor-hydrate/constructor-hydrate'
import canMap from 'can-connect/can/map/map'
import dataCallbacks from 'can-connect/data/callbacks/callbacks'
import realtime from 'can-connect/real-time/real-time'
import feathersAuthenticationSignedSession from 'feathers-authentication-signed/behavior'

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
    get (val) {
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
      if (val) {
        return val
      }
      console.log('[session.portfolios.get] ...')
      this.portfoliosPromise.then(portfolios => {
        portfolios.forEach(portfolio => {
          if (portfolio.index !== 'undefined') {
            portfolio.keys = this.user.generatePortfolioKeys(portfolio.index)
            portfolio.rates = this.rates
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
  refreshBalance: function (options) {
    // Mark portfolio address as used:
    if (options && options.transactionEvent && options.transactionEvent.type === 'IN') {
      const { address, currencyType } = options.transactionEvent
      this.portfolio.markAsUsed(address, currencyType)
    }
    if (this.portfolios && this.portfolios[0]) {
      this.portfolios[0].refreshBalance()
    }
    // load company/issuance UTXO:
    this.issuancesPromise = Math.random()
  },

  /**
   * @property {Function} models/session.prototype.balance balance
   * @parent models/session.prototype
   * User balance contains a summary from all portfolios.
   * ```
   * {
   *    "summary": {
   *      "total": 3.34999
   *      "cash": 3.34999
   *      "securities": 0
   *    }
   * }
   * ```
   */
  balance: {
    get () {
      if (!this.portfolios) {
        return {
          summary: { cash: 0, securities: 0, total: 0 },
          isPending: true
        }
      }
      return this.portfolios.reduce((acc, portfolio) => {
        if (!portfolio.balance) {
          acc.isPending = true
          return acc
        }
        acc.summary.cash += portfolio.balance.cashTotal
        acc.summary.securities += portfolio.balance.securities
        acc.summary.total = acc.summary.cash + acc.summary.securities
        return acc
      }, { summary: { cash: 0, securities: 0, total: 0 } })
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
    get (val) {
      return this.user && Issuance.getList({userId: this.user._id})
    }
  },
  issuances: {
    Type: Issuance.List,
    get (val, resolve) {
      if (this.issuancesPromise) {
        this.issuancesPromise.then(issuances => {
          issuances.forEach(issuance => {
            if (issuance.index !== 'undefined') {
              const companyHdNode = this.user.generatePortfolioKeys(issuance.companyIndex).EQB
              issuance.keys = companyHdNode.derive(issuance.index)
            }
          })
          issuances.loadUTXO()
          resolve && resolve(issuances)
        })
      }
      return val
    }
  },
  userHasIssuances: {
    get (val, resolve) {
      return this.issuancesPromise.then(issuances => {
        resolve(!!issuances && issuances.length > 0)
      })
    }
  },

  issuancePassports: {
    get () {
      // For a user's own issuances, find all passports that are also linked to that
      // issuance.
      return []
    }
  },

  passportAuthorities: {
    get () {
      return []
    }
  },

  /**
   * @property {Function} models/session.prototype.allAddresses allAddresses
   * @parent models/session.prototype
   * List of all addresses by type. Includes authorized issuances. To use for getting transactions.
   */
  allAddresses: {
    get () {
      const issuanceAddresses = this.issuances.reduce((acc, issuance) => {
        acc.push(issuance.address)
        return acc
      }, [])
      return this.portfolios && this.portfolios.reduce((acc, portfolio) => {
        return {
          BTC: acc.BTC.concat(portfolio.addressesBtc.get()),
          EQB: acc.EQB.concat(portfolio.addressesEqb.get())
        }
      }, {EQB: issuanceAddresses, BTC: []})
    }
  },

  isLoading: {
    get (val, resolve) {
      Promise.all([
        this.issuancesPromise,
        this.portfoliosPromise
      ]).then(() => resolve(false))
      return true
    }
  }
})

Session.defaultRates = {
  btcToUsd: 5000,
  eqbToUsd: 1000,
  eqbToBtc: 1000 / 5000,
  securitiesToBtc: 1 / 5
}

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
if (typeof window !== 'undefined') {
  window.Session = Session
}
//! steal-remove-end

export default Session
