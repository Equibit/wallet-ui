/**
 * @module {can-map} models/portfolio Portfolio
 * @parent models.auth
 *
 * Portfolio model
 *
 * @group models/portfolio.properties 0 properties
 */

import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import canDefineStream from 'can-define-stream-kefir'
import feathersClient from './feathers-client'
import { superModelNoCache } from './super-model'
import algebra from '~/models/algebra'
// import Session from '~/models/session'
import utils from './portfolio-utils'
const {
  importAddr,
  getNextAddressIndex,
  getUnspentOutputsForAmount,
  fetchBalance,
  getAllUtxo
} = utils

const portfolioService = feathersClient.service('portfolios')

const Portfolio = DefineMap.extend('Portfolio', {
  '*': {
    serialize: false
  },

  /**
   * @property {String} models/portfolio.properties._id _id
   * @parent models/portfolio.properties
   * Id prop
   */
  _id: {
    serialize: true,
    type: 'string'
  },
  index: 'number',
  userId: 'string',

  /**
   * @property {String} models/portfolio.properties.name name
   * @parent models/portfolio.properties
   * Name of the portfolio. Default: My Portfolio.
   */
  name: {
    serialize: true,
    type: 'string'
  },

  /**
   * Address information: what blockchain it belongs to, whether its a change, and what its index is.
   * @property {String} models/portfolio.properties.addressesMeta addressesMeta
   * @parent models/portfolio.properties
   * Tracking addresses by index for one-time usage.
   * ```
   * [
   *   {index: 0, type: 'EQB', isChange: false, isUsed: true},  // -> /m/44/<eqb_or_btc>/portfolio/<0_or_1>/index
   *   {index: 1, type: 'EQB', isChange: false, used: false},
   *   {index: 0, type: 'BTC', isChange: false, used: true},
   * ]
   * ```
   */
  addressesMeta: {
    serialize: true,
    // Type: DefineList,
    // value: new DefineList([])
    // TODO: should this be an observable list? can it be updated via websocket?
    // Note: this is not an observable list to not trigger linstunspent request.
    value: []
  },

  keys: '*',
  rates: '*',

  /**
   * @property {String} models/portfolio.properties.addresses addresses
   * @parent models/portfolio.properties
   * A list of address objects that includes real addresses, amount and txouts.
   */
  addresses: {
    get () {
      // TODO: make sure this getter is cached (maybe change to a stream derived from addressesMeta).
      console.log('[portfolio.addresses] deriving addresses...')
      return (this.keys && this.addressesMeta && this.addressesMeta.map(meta => {
        const keysNode = this.keys[meta.type].derive(meta.isChange ? 1 : 0).derive(meta.index)
        return {
          index: meta.index,
          address: keysNode.getAddress(),
          type: meta.type,
          isChange: meta.isChange,
          isUsed: meta.isUsed,
          keyPair: keysNode.keyPair
        }
      })) || []
    }
  },

  /**
   * @property {String} models/portfolio.properties.addressesList addressesList
   * @parent models/portfolio.properties
   * A flat list of portfolio addresses to be used for `/listunspent` request.
   */
  addressesBtc: {
    get () {
      return this.addresses.filter(a => a.type === 'BTC').map(a => a.address)
    }
  },
  addressesEqb: {
    get () {
      return this.addresses.filter(a => a.type === 'EQB').map(a => a.address)
    }
  },

  /**
   * @property {Function} models/session.prototype.listunspentPromise listunspentPromise
   * @parent models/session.prototype
   * Promise for balance.
   */
  listunspentPromise: {
    stream: function () {
      const addrStream = this.toStream('.addresses').skipWhile(a => (!a || !a.length))
      return addrStream.merge(this.toStream('refresh')).map(() => {
        console.log('*** [portfolio.listunspentPromise] fetching balance...')
        return fetchBalance({
          BTC: this.addressesBtc,
          EQB: this.addressesEqb
        })
      })
    }
  },

  // TODO: all amounts should be in satoshi. ???
  // Unspent Transaction Output map by blockchain type and by address.
  utxoByTypeByAddress: {
    get (val, resolve) {
      if (val) {
        return val
      }
      if (this.listunspentPromise) {
        // TODO: filter out UTXO for this portfolio.
        this.listunspentPromise.then(resolve)
      }
    }
  },
  utxoByType: {
    get () {
      if (this.utxoByTypeByAddress) {
        return {
          BTC: getAllUtxo(this.utxoByTypeByAddress.BTC.addresses),
          EQB: getAllUtxo(this.utxoByTypeByAddress.EQB.addresses)
        }
      }
    }
  },

  /**
   * @property {String} models/portfolio.properties.balance balance
   * @parent models/portfolio.properties
   * Portfolio's balance gets calculated when user's balance is loaded.
   *
   * ```
   * {
   *   cashBtc: 1,
   *   cashEqb: 3,
   *   cashTotal: 4,
   *   securities: 6,
   *   total: 10
   * }
   * ```
   * A security is a TX output that contains non-zero `equibit.issuance_tx_id`.
   * The field `equibit.issuance_json` should always be empty for a portfolio. It can only be non-empty under a company.
   */
  balance: {
    get () {
      if (!this.utxoByTypeByAddress) {
        console.log('portfolio.balance is undefined - no utxo yet...')
        return
      }
      const utxoByType = this.utxoByTypeByAddress

      // TODO: figure out how to evaluate securities.

      const { cashBtc, cashEqb, cashTotal, securities } = this.addresses.reduce((acc, addr) => {
        const utxo = utxoByType[addr.type]
        if (utxo && utxo.addresses[addr.address]) {
          const amount = utxo.addresses[addr.address].amount
          // Calculate summary:
          if (addr.type === 'BTC') {
            acc.cashBtc += amount
            acc.cashTotal += amount
          } else {
            acc.cashEqb += amount
            acc.cashTotal += this.rates.eqbToBtc * amount
          }
        }
        acc.total = acc.cashTotal + acc.securities
        return acc
      }, {cashBtc: 0, cashEqb: 0, cashTotal: 0, securities: 0, total: 0})

      const total = cashTotal + securities

      console.log(`portfolio.balance.total is ${total}`)
      return new DefineMap({ cashBtc, cashEqb, cashTotal, securities, total })
    }
  },

  unrealizedPL: {type: 'number', value: 0},
  unrealizedPLPercent: {type: 'number', value: 0},
  createdAt: 'date',
  updatedAt: 'date',

  /**
   * @function {String} models/portfolio.properties.nextAddress nextAddress
   * @parent models/portfolio.methods
   * Returns next available address wrapped into a Promise (because addr has to be imported and saved).
   */
  // "m /44' /0' /portfolio-index' /0 /index"
  nextAddress () {
    return this.getNextAddress(false)
  },

  // "m /44' /0' /portfolio-index' /1 /index"
  nextChangeAddress () {
    return this.getNextAddress(true)
  },

  /**
   * Generates the next available address to receive cash or unrestricted securities.
   * @param isChange
   * @returns {*}
   */
  // getNextAddress :: Bool -> Object(EQB<String>,BTC<String>)
  getNextAddress (isChange = false) {
    const changeIndex = isChange ? 1 : 0
    const btcAddr = getNextAddressIndex(this.addressesMeta, 'BTC', isChange)
    const eqbAddr = getNextAddressIndex(this.addressesMeta, 'EQB', isChange)
    const btcNode = this.keys.BTC.derive(changeIndex).derive(btcAddr.index)
    const eqbNode = this.keys.EQB.derive(changeIndex).derive(eqbAddr.index)
    const addr = {
      BTC: btcNode.getAddress(),
      EQB: eqbNode.getAddress()
    }
    if (btcAddr.imported === false) {
      // Import addr as watch-only
      importAddr(addr.BTC, 'btc')
      // Mark address as generated/imported but not used yet:
      this.addressesMeta.push({index: btcAddr.index, type: 'BTC', isUsed: false, isChange})
    }
    if (eqbAddr.imported === false) {
      // Import addr as watch-only
      importAddr(addr.EQB, 'eqb')
      // Mark address as generated/imported but not used yet:
      this.addressesMeta.push({index: eqbAddr.index, type: 'EQB', isUsed: false, isChange})
    }
    if (!eqbAddr.imported || !btcAddr.imported) {
      // Save newly generated addresses to DB:
      console.log('[portfolio.getNextAddress] patching portfolio with updated addressesMeta ...')
      return this.patch({
        addressesMeta: this.addressesMeta
      }).then(() => addr)
    } else {
      return Promise.resolve(addr)
    }
  },

  // Methods:
  hasEnoughFunds (amount, type) {
    return amount === 0 || !!this.getTxouts(amount, type).length
  },

  /**
   * @function getTxouts
   * Returns txouts that contain enough funds in them.
   * @param amount
   * @param type
   * @returns {*}
   */
  getTxouts (amount, type) {
    if (!this.utxoByTypeByAddress) {
      return
    }
    if (this.utxoByTypeByAddress[type].summary.total < amount) {
      return []
    }
    return getUnspentOutputsForAmount(this.utxoByType[type], amount)
  },

  /**
   * @function findAddress
   * Returns address info.
   * @param addr
   * @returns {*}
   */
  findAddress (addr) {
    return this.addresses.reduce((acc, a) => (a.address === addr ? a : acc), null)
  },

  /**
   * @function markAsUsed
   * Updates addressesMeta item as used and saves the portfolio.
   * @param {String} changeAddr
   * @param {String} currencyType
   * @param {Boolean} isChange
   * @returns {*}
   */
  markAsUsed (addr, currencyType, isChange) {
    const addressItem = this.findAddress(addr)
    if (!addressItem) {
      console.warn(`*** The address is not in the list of this portfolio: ${addr}, ${currencyType}, isChange=${isChange}`)
      return
    }
    if (addressItem.type !== currencyType) {
      console.warn(`*** The address is used for a different currencyType of ${addressItem.type}! ${addr}, ${currencyType}, isChange=${isChange}`)
    }
    if (addressItem.meta.isUsed) {
      console.warn(`*** The following address was already used! ${addr}, ${currencyType}, isChange=${isChange}`)
    } else {
      console.log(`[portfolio.markAsUsed] ${addr}, ${currencyType}, isChange=${isChange}`)
      addressItem.meta.isUsed = true
      console.log('[portfolio.markAsUsed] patching portfolio with updated addressesMeta ...')
      return this.patch({
        addressesMeta: this.addressesMeta
      })
    }
  },
  patch (data) {
    return portfolioService.patch(this._id, data)
  },

  /**
   * @property {Function} models/session.prototype.refreshBalance refreshBalance
   * @parent models/session.prototype
   * Method to refresh balance. Will request linstunspent and update balancePromise.
   */
  refreshBalance: function () {
    this.dispatch('refresh')
  }
})

canDefineStream(Portfolio)

Portfolio.List = DefineList.extend('PortfolioList', {
  '#': Portfolio,
  findByAddress (addr) {
    return this.reduce((acc, portfolio) => {
      return acc || (portfolio.findAddress(addr) && portfolio)
    }, null)
  }
})

Portfolio.connection = superModelNoCache({
  Map: Portfolio,
  List: Portfolio.List,
  feathersService: feathersClient.service('/portfolios'),
  name: 'portfolio',
  algebra
})

Portfolio.algebra = algebra

export default Portfolio

// Import an address to be added as watch-only to the built-in wallet:
// http://localhost:3030/proxycore?method=importaddress&params[]=mwd7FgMkm9yfPmNTnntsRbugZS7BEZaf32

// List unspent TOs for given addresses:
// http://localhost:3030/proxycore?method=listunspent&params[0]=0&params[1]=99999&params[2][]=mp9GiieHrLQvLu4C8nE9bbwxNmXqcC3nVf&params[2][]=mwd7FgMkm9yfPmNTnntsRbugZS7BEZaf32
