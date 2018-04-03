/**
 * @module {can-map} models/portfolio Portfolio
 * @parent models.auth
 *
 * Portfolio model
 *
 * @group models/portfolio.properties 0 properties
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import canDefineStream from 'can-define-stream-kefir'
import feathersClient from './feathers-client'
import { superModelNoCache } from './super-model'
import algebra from './algebra'
// import Session from '~/models/session'
import Issuance from '~/models/issuance'
import utils from './portfolio-utils'
import currencyConverter from '~/utils/currency-converter'
const {
  getNextAddressIndex,
  getUnspentOutputsForAmount,
  fetchListunspent,
  getAllUtxo
} = utils

const EMPTY_ISSUANCE_TX_ID = '0000000000000000000000000000000000000000000000000000000000000000'

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
   *   {index: 1, type: 'EQB', isChange: false, isUsed: false},
   *   {index: 0, type: 'BTC', isChange: false, isUsed: true},
   * ]
   * ```
   */
  addressesMeta: {
    get () {
      const list = this._addressesMeta
      if (!list.length) {
        feathersClient.service('portfolio-addresses').find({
          query: {
            portfolioId: this._id
          }
        }).then((results) => {
          const portfolioAddresses = results.data
          list.replace(portfolioAddresses)
          // console.log("portfolioAddresses", portfolioAddresses)
        })
      }
      return list
    }
  },
  _addressesMeta: {
    serialize: true,
    Type: DefineList,
    value: new DefineList([])
    // TODO: should this be an observable list? can it be updated via websocket?
    // Note: this is not an observable list to not trigger linstunspent request.
    // value: []
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
          keyPair: keysNode.keyPair,
          meta: meta
        }
      })) || new DefineList([])
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

  doImport: { type: 'boolean', value: true },

  /**
   * @property {Function} models/session.prototype.listunspentPromise listunspentPromise
   * @parent models/session.prototype
   * Promise for balance.
   */
  listunspentPromise: {
    stream: function () {
      const addrStream = this.toStream('.addresses').skipWhile(a => (!a || !a.length))
      return addrStream.merge(this.toStream('refresh')).map(() => {
        // just once when we first login, tell server to import all the addresses
        const doImport = this.doImport
        this.doImport = false

        console.log('*** [portfolio.listunspentPromise] fetching balance...')
        return fetchListunspent({
          doImport,
          BTC: this.addressesBtc.get(),
          EQB: this.addressesEqb.get()
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
  // Flat lists of addresses by node type BTC and EQB:
  // utxoByType :: Object<BTC:List<Address>, EQB:List<Address>>
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
  // List of securities. For displaying in my-portfolio grid.
  // utxoSecurities :: List<UTXO>
  utxoSecurities: {
    get () {
      if (!this.utxoByTypeByAddress || !this.utxoByTypeByAddress.EQB) {
        return
      }
      const eqbAddresses = this.utxoByTypeByAddress.EQB.addresses
      return Object.keys(eqbAddresses).reduce((acc, addr) => {
        const txouts = eqbAddresses[addr].txouts
        const securities = txouts.filter(out => {
          return out.equibit.issuance_tx_id && out.equibit.issuance_tx_id !== EMPTY_ISSUANCE_TX_ID
        })
        acc.push.apply(acc, securities)
        return acc
      }, [])
    }
  },
  // List of empty EQB.
  // utxoEmptyEqb :: List<UTXO>
  utxoEmptyEqb: {
    get () {
      if (!this.utxoByTypeByAddress || !this.utxoByTypeByAddress.EQB) {
        return
      }
      const eqbAddresses = this.utxoByTypeByAddress.EQB.addresses
      return Object.keys(eqbAddresses).reduce((acc, addr) => {
        const txouts = eqbAddresses[addr].txouts
        const emptyEqb = txouts.filter(out => {
          return !out.equibit.issuance_tx_id || out.equibit.issuance_tx_id === EMPTY_ISSUANCE_TX_ID
        })
        acc.push.apply(acc, emptyEqb)
        return acc
      }, [])
    }
  },

  securitiesPromise: '*',
  // issuances that current user's utxo are attached to/came from.
  securities: {
    get (lastSetVal, resolve) {
      if (!this.utxoSecurities) {
        return
      }

      // The number of issuances returned is a <= number of utxoSecurities
      // each issuance will have a `utxo` property that's an array of related utxo from addresses controlled by current user
      // the number of grouped utxo should be equal to number of issuances returned
      const utxoGroupedByIssuanceTxId = {}
      const issuanceTxIds = this.utxoSecurities.map(utxo => {
        const txId = utxo && utxo.equibit && utxo.equibit.issuance_tx_id
        utxoGroupedByIssuanceTxId[txId] = utxoGroupedByIssuanceTxId[txId] || []
        utxoGroupedByIssuanceTxId[txId].push(utxo)
        return txId
      })

      if (!issuanceTxIds.length) {
        return
      }

      const issuanceParams = {
        issuanceTxId: {
          $in: issuanceTxIds // ['2ec669da941f06d047d3ead54b2a2a563e7f28235622136f89e0668a27c7d478']
        },
        $limit: 100,
        $skip: 0
      }
      this.securitiesPromise = Issuance.getList(issuanceParams)
        .then(issuances => {
          // now, for every issuance, attach its related utxoGroupedByIssuanceTxId group
          issuances.forEach(issuance => {
            issuance.utxo = utxoGroupedByIssuanceTxId[ issuance.issuanceTxId ]
          })

          // resolve the getter and promise with the issuances
          resolve(issuances)
          return issuances
        })
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
    get (val, resolve) {
      if (val) {
        return val
      }
      if (!this.utxoByTypeByAddress) {
        console.log('portfolio.balance is undefined - no utxo yet...')
        return
      }
      const utxoByType = this.utxoByTypeByAddress

      // TODO: figure out how to evaluate securities.
      const updatePromises = []

      const totals = this.addresses.reduce((acc, addr) => {
        const utxo = utxoByType[addr.type]
        if (utxo && utxo.addresses[addr.address]) {
          const amount = utxo.addresses[addr.address].amount
          const txouts = utxo.addresses[addr.address].txouts
          // Calculate summary:
          if (addr.type === 'BTC') {
            acc.cashBtc += amount
            acc.cashTotal += amount
          } else {
            // Check for securities:
            updatePromises.push(getSecuritiesAmount(txouts).then(securitiesAmount => {
              acc.securities += securitiesAmount.total
              acc.cashEqb += amount - securitiesAmount.amount
            }))
          }
        }
        return acc
      }, {cashBtc: 0, cashEqb: 0, cashTotal: 0, securities: 0})

      totals.total = totals.cashTotal + totals.securities

      const retVal = new DefineMap(totals)
      updatePromises.unshift(currencyConverter.convertCryptoToCrypto(1, 'EQB', 'BTC'))

      Promise.all(updatePromises).then(([eqbToBtc, ...rest]) => {
        // once all the promises resolve, update the totals in the returned map
        totals.cashTotal += totals.cashEqb * eqbToBtc
        totals.total = totals.cashTotal + totals.securities
        retVal.assign(totals)
        resolve && resolve(retVal)
      })
      console.log(`portfolio.balance.total is ${totals.total}`)
      return resolve ? undefined : retVal
    }
  },

  unrealizedPL: {type: 'number', value: 0},
  unrealizedPLPercent: {type: 'number', value: 0},
  createdAt: 'date',
  updatedAt: 'date',
  importFrom: 'date',

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

  createPortfilioAddressesRecord (portfolioAddressesCreateData) {
    return feathersClient.service('portfolio-addresses')
      .create(portfolioAddressesCreateData)
      .then((results) => {
        // To avoid address duplication due to the way addressesMeta is defined
        if (this.addressesMeta.filter(a => a._id === results._id).length === 0) {
          this.addressesMeta.push(results)
          // console.log("new portfolioAddresses entry", results)
        }
      })
  },

  /**
   * Generates the next available address to receive cash or unrestricted securities.
   * @param isChange
   * @returns {Promise | Object}
   */
  // getNextAddress :: Bool -> Object(EQB<String>,BTC<String>)
  getNextAddress (isChange = false, sync = false) {
    const changeIndex = isChange ? 1 : 0
    const btcAddrIndex = getNextAddressIndex(this.addressesMeta, 'BTC', isChange)
    const eqbAddrIndex = getNextAddressIndex(this.addressesMeta, 'EQB', isChange)
    const btcNode = this.keys.BTC.derive(changeIndex).derive(btcAddrIndex.index)
    const eqbNode = this.keys.EQB.derive(changeIndex).derive(eqbAddrIndex.index)
    const addr = {
      BTC: btcNode.getAddress(),
      EQB: eqbNode.getAddress()
    }
    const portfolioAddressesCreatePromises = []

    if (btcAddrIndex.imported === false) {
      // Import addr as watch-only while creating the portfilio-addresses meta record
      let createPromise = this.createPortfilioAddressesRecord({
        importAddress: addr.BTC,
        portfolioId: this._id,
        index: btcAddrIndex.index,
        type: 'BTC',
        isUsed: false,
        isChange
      })
      // Mark address as generated/imported but not used yet:
      portfolioAddressesCreatePromises.push(createPromise)
    }
    if (eqbAddrIndex.imported === false) {
      // Import addr as watch-only while creating the portfilio-addresses meta record
      let createPromise = this.createPortfilioAddressesRecord({
        importAddress: addr.EQB,
        portfolioId: this._id,
        index: eqbAddrIndex.index,
        type: 'EQB',
        isUsed: false,
        isChange
      })
      // Mark address as generated/imported but not used yet:
      portfolioAddressesCreatePromises.push(createPromise)
    }
    if (sync) {
      return addr
    } else {
      return Promise.all(portfolioAddressesCreatePromises).then(() => addr)
    }
  },

  // Methods:
  hasEnoughFunds (amount, type) {
    if (['BTC', 'EQB'].indexOf(type) === -1) {
      console.error(`Invalid type ${type}. Expects "EQB" or "BTC"`)
    }
    return amount === 0 || !!this.getTxouts(amount, type).txouts.length
  },

  /**
   * @function getTxouts
   * Returns txouts that contain enough funds in them.
   * @param amount
   * @param type
   * @returns {Object<sum:Number,txouts:Array>}
   */
  getTxouts (amount, type) {
    if (!this.utxoByTypeByAddress) {
      return {sum: 0, txouts: []}
    }
    if (this.utxoByTypeByAddress[type].summary.total < amount) {
      return {sum: 0, txouts: []}
    }
    return getUnspentOutputsForAmount(this.utxoByType[type], amount)
  },

  getEmptyEqb (amount) {
    const utxo = getUnspentOutputsForAmount(this.utxoEmptyEqb, amount)
    return utxo
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
    if (typeof isChange === 'undefined') {
      isChange = addressItem.meta.isChange
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
      return feathersClient.service('portfolio-addresses')
        .patch(addressItem.meta._id, {isUsed: true})
        .then((results) => {
          console.log('[portfolio.metaAddresses[x].isUsed]', results)
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
    return this.securitiesPromise
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

// Calculate securities quantity from utxo:
const getSecuritiesAmount = utxo => {
  const issuanceUTXO = utxo
    .filter(out => (out.equibit && out.equibit.issuance_tx_id && out.equibit.issuance_tx_id !== EMPTY_ISSUANCE_TX_ID))

  return Promise.all([
    Issuance.getList({ issuanceTxId: { $in: issuanceUTXO.map(out => out.equibit.issuance_tx_id) } }),
    currencyConverter.convertCryptoToCrypto(1, 'EQB', 'BTC')
  ]).then(([issuances, eqbToBtcRate]) => {
    const issuancesByTxId = issuances.reduce((all, iss) => { all[iss.issuanceTxId] = iss; return all }, {})

    return issuanceUTXO.reduce((acc, out) => {
      acc.total += out.amount * issuancesByTxId[out.equibit.issuance_tx_id].currentPricePerShare
      acc.amount += out.amount
      acc.btcEquivalentAmount += out.amount * eqbToBtcRate
      return acc
    }, { total: 0, amount: 0, btcEquivalentAmount: 0 })
  })
}

export default Portfolio

// Import an address to be added as watch-only to the built-in wallet:
// http://localhost:3030/proxycore?method=importaddress&params[]=mwd7FgMkm9yfPmNTnntsRbugZS7BEZaf32

// List unspent TOs for given addresses:
// http://localhost:3030/proxycore?method=listunspent&params[0]=0&params[1]=99999&params[2][]=mp9GiieHrLQvLu4C8nE9bbwxNmXqcC3nVf&params[2][]=mwd7FgMkm9yfPmNTnntsRbugZS7BEZaf32
