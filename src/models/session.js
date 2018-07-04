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
import diffArray from 'can-util/js/diff/'
import Observation from 'can-observation'

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

if (feathersClient.io) {
  feathersClient.io.on('reconnect', function () {
    if (Session.current) {
      const addresses = Session.current.allAddresses
      if (addresses.EQB.length + addresses.BTC.length > 0) {
        feathersClient.service('/subscribe').create({
          addresses: addresses.EQB.concat(addresses.BTC)
        })
      }
    }
  })
}

const Session = DefineMap.extend('Session', {
  /**
   * @property {User} models/session.prototype.user user
   * @parent models/session.prototype
   * User instance.
   */
  user: {
    Type: User
  },

  /**
   * @property {Promise} models/session.prototype.portfoliosPromise portfoliosPromise
   * @parent models/session.prototype
   * Promise for portfolios live list.
   */
  portfoliosPromise: {
    get (val) {
      console.log('[session.portfoliosPromise.get] ...')
      // TODO: report that portfolio.patch breaks Portfolio.connection.listStore if a set different from `{}` is used.
      // We do not need to provide userId since feathers does this for us (restricts to current user via JWT)
      return Portfolio.getList({}).then(portfolios => {
        portfolios.forEach(portfolio => {
          if (portfolio.index !== 'undefined') {
            portfolio.keys = this.user.generatePortfolioKeys(portfolio.index)
          }
        })
        return portfolios
      })
    }
  },

  /**
   * @property {Portfolios.List} models/session.prototype.portfoliosMeta portfoliosMeta
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
        console.log('[session.portfolios.get -> resolve] length=' + portfolios.length)
        resolve && resolve(portfolios)
      })
    }
  },

  /**
   * Rates to calculate transaction fee. Satoshi per byte.
   */
  feeRates: {

  },

  portfolioRefreshPromise: {
    get (val) {
      return this.portfoliosPromise.then(portfolios => {
        if (portfolios && portfolios[0]) {
          return Promise.all([
            portfolios[0].balancePromise,
            portfolios[0].addressesPromise,
            portfolios[0].refreshBalance()
          ])
        }
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
    return this.portfoliosPromise.then(portfolios => {
      if (options && options.transactionEvent && options.transactionEvent.type === 'IN') {
        const { address, currencyType } = options.transactionEvent
        portfolios[0].markAsUsed(address, currencyType)
      }
      if (this.portfolios && this.portfolios[0]) {
        this.portfolioRefreshPromise = portfolios[0].refreshBalance()
      }
      // load company/issuance UTXO:
      this.issuancesPromise = Math.random()
      return Promise.all([
        this.portfolioRefreshPromise,
        this.issuancesPromise
      ])
    })
  },

  /**
   * @property {Object} models/session.prototype.balance balance
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
        if (!portfolio.balance || portfolio.balance.isPending) {
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

  // todo: connect to API
  // Transaction fee rate, Satoshi per byte.
  transactionFeeRatesPromise: {
    get () {
      return Promise.resolve({
        priority: { EQB: 20, BTC: 20 },
        regular: { EQB: 5, BTC: 5 }
      })
    }
  },

  _notificationsPromise: '*',
  get notificationsPromise () {
    const allAddresses = this.allAddresses
    if (allAddresses.isPending) {
      return Observation.ignore(() => {
        return this._notificationsPromise
      })()
    }
    let retval
    if (allAddresses.BTC.length + allAddresses.EQB.length > 0) {
      retval = Notification.getList({
        address: {
          $in: allAddresses.BTC.concat(allAddresses.EQB)
        },
        $sort: {
          createdAt: -1
        }
      })
    } else {
      retval = Promise.resolve([])
    }
    Observation.ignore(() => {
      this._notificationsPromise = retval
    })()
    return retval
  },

  notifications: {
    get (val, resolve) {
      if (this.issuances && this.portfolios) {
        this.notificationsPromise.then(resolve)
      }
      return []
    }
  },

  // These are authorized issuances that belong to the current user.
  issuancesPromise: {
    get (val) {
      // For testing allow incoming value:
      if (val && val.then) {
        return val
      }
      return this.user && Issuance.getList({userId: this.user._id}).then(issuances => {
        // todo: consider putting this into Issuance init (or utxo getter/value).
        console.log(`Session.issuancesPromise: deriving keys and loading UTXO... issuances=${issuances.length}`)
        issuances.forEach(issuance => {
          if (typeof issuance.index !== 'undefined') {
            const companyHdNode = this.user.generatePortfolioKeys(issuance.companyIndex).EQB
            issuance.keys = companyHdNode.derive(issuance.index)
          }
        })
        if (issuances.length) {
          issuances.loadUTXO()
        }
        return issuances
      })
    }
  },
  /**
   * @property {Issuance.List} models/session.prototype.issuances issuances
   * @parent models/session.prototype
   * Issuances that belong to the user (authorized by him), but are not a part of his portfolio (as investor).
   */
  issuances: {
    type: function (val) {
      if (val instanceof Issuance.List) {
        return val
      } else {
        return new Issuance.List(val)
      }
    },
    get (val, resolve) {
      if (this.issuancesPromise) {
        this.issuancesPromise.then(resolve)
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

  _lastAddresses: {
    type: '*',
    value: {
      BTC: [],
      EQB: []
    }
  },
  /**
   * @property {Function} models/session.prototype.allAddresses allAddresses
   * @parent models/session.prototype
   * List of all addresses by type. Includes authorized issuances. To use for getting transactions.
   */
  allAddresses: {
    get () {
      const issuances = this.issuances
      const portfolios = this.portfolios
      const issuanceAddresses = issuances ? issuances.reduce((acc, issuance) => {
        acc.push(issuance.address)
        return acc
      }, []) : []
      let results = {EQB: issuanceAddresses, BTC: []}
      results = portfolios ? portfolios.reduce((acc, portfolio) => {
        const ret = {
          BTC: acc.BTC.concat(portfolio.addressesBtc.get()),
          EQB: acc.EQB.concat(portfolio.addressesEqb.get())
        }
        Object.defineProperty(ret, 'isPending', { enumerable: false, value: acc.isPending || portfolio.addresses.isPending })
        return ret
      }, results) : results

      // Ignore observations here because we don't want to re-run this getter when
      // setting the _lastAddresses (which would happen normally because we're also
      // reading from that property here)
      Observation.ignore(() => {
        const diffsBTC = diffArray(this._lastAddresses.BTC, results.BTC)
        const diffsEQB = diffArray(this._lastAddresses.EQB, results.EQB)

        let newAddresses = diffsBTC.reduce((diffs, patch) => diffs.concat(patch.insert), [])
        newAddresses = diffsEQB.reduce((diffs, patch) => diffs.concat(patch.insert), newAddresses)

        if (newAddresses.length > 0) {
          feathersClient.service('/subscribe').create({
            addresses: newAddresses
          })
        }
      })()

      this._lastAddresses = results
      return results
    }
  },

  isLoading: {
    get (val, resolve) {
      Promise.all([
        this.issuancesPromise,
        this.portfolioRefreshPromise
      ])
      .then(() => Promise.all([
        this.issuances && this.issuances.importAddressesPromise,
        this.portfolios && this.portfolios[0] && this.portfolios[0].securitiesPromise,
        this.portfolios && this.portfolios[0] && this.portfolios[0].addressesPromise
      ]))
      .then(() => setTimeout(() => {
        resolve(false)
      }, 500), err => { console.error(err); resolve(false) })
      return resolve ? resolve(true) : true
    }
  },

  // todo: move this to issuance model.
  getUtxoForIssuance (issuanceAddress) {
    const securities = (this.portfolios &&
      this.portfolios[0] &&
      this.portfolios[0].securities) || []
    const issuance = ((new DefineList()).concat(securities, (this.issuances || []))).reduce((res, sec) => {
      return res || (sec.issuanceAddress === issuanceAddress && sec)
    }, null)
    return (issuance && issuance.utxo) || []
  },
  getAvailableAmountForIssuance (issuanceAddress) {
    const utxo = this.getUtxoForIssuance(issuanceAddress)
    return utxo.reduce((acc, utxo) => (acc + utxo.amount), 0)
  },

  /**
   * Is used in order-book and orders-grid to check if user can create an offer.
   * @param issuanceAddress
   * @returns Boolean
   */
  hasIssuanceUtxo (issuanceAddress) {
    // todo: technically `issuance.utxo` should be populated for both investor and issuer cases.
    const userHasPortfolioIssuances = this.getUtxoForIssuance(issuanceAddress).length > 0
    const userHasAuthorizedIssuancesUtxo = this.issuances &&
      this.issuances.filter(issuance => {
        return issuance.issuanceAddress === issuanceAddress && issuance.utxo && issuance.utxo.length
      }).length > 0

    return userHasPortfolioIssuances || userHasAuthorizedIssuancesUtxo
  }
})

Session.fiatCurrency = function () {
  // TODO use geolocation or reverse IP for lookup
  return this.current && this.current.user
    ? this.current.user.fiatCurrency
    : 'USD'
}

/**
 * refresh the JWT token for a session that is already created/logged in
 * @parent Session
 * @param  {[Session]} session optional session if Session.current is not the session.
 * @return {Promise}  a promise that resolves to the session login data.
 */
Session.refresh = function (session = Session.current) {
  return session.user.refresh(Session.connection)
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
