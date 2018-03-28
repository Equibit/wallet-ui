/**
 * @module {can-map} models/offer Offer
 * @parent models.auth
 *
 * Offer for buy or sell securities
 *
 * @group models/offer.properties 0 properties
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
// import superModel from './super-model'
import { superModelNoCache as superModel } from './super-model'
import algebra from './algebra'
import Issuance from './issuance'
import Order from './order'
import moment from 'moment'
import { translate } from '../i18n/i18n'
import Transaction from './transaction/'
import { blockTime } from '~/constants'

const Offer = DefineMap.extend('Offer', {
  _id: 'string',

  /**
   * @property {Number} models/offer.properties.userId userId
   * @parent models/offer.properties
   * Id of the user this offer belongs to
   */
  userId: 'string',

  /**
   * @property {Number} models/offer.properties.orderId orderId
   * @parent models/offer.properties
   * Id of the related order
   */
  orderId: 'string',

  /**
   * @property {Number} models/offer.properties.issuanceId issuanceId
   * @parent models/offer.properties
   * Id of the issuance
   */
  issuanceId: 'string',

  /**
   * @property {Number} models/offer.properties.issuanceAddress issuanceAddress
   * @parent models/offer.properties
   * Public address of the issuance for the offer
   */
  issuanceAddress: 'string',

  // For HTLC we need 2 or 3 addresses:
  // - Buy offer:
  //    1. btcAddress for our own refund.
  //    2. eqbAddress for receiving securities from a seller.
  // - Sell offer:
  //    1. eqbAddress for a refund.
  //    2. btcAddress for receiving payment from a buyer.
  btcAddress: 'string',
  eqbAddress: 'string',

  /**
   * @property {Number} models/offer.properties.type type
   * @parent models/offer.properties
   * Type of the offer. Enum (SELL | BUY).
   */
  type: 'string',

  /**
   * @property {Number} models/offer.properties.quantity quantity
   * @parent models/offer.properties
   * Quantity of units of the issuance in satoshi EQB
   */
  quantity: 'number',

  /**
   * @property {Number} models/offer.properties.price price
   * @parent models/offer.properties
   * Price of one unit of the issuance, in satoshi BTC
   */
  price: 'number',

  // ENUM ('OPEN', 'TRADING', 'CANCELLED', 'CLOSED')
  status: {
    type: 'string'
  },

  /**
   * @property {Number} models/offer.properties.isAccepted isAccepted
   * @parent models/offer.properties
   * Indicates whether this offer was accepted
   */
  isAccepted: 'boolean',

  // Issuance info:
  companyName: 'string',
  issuanceName: 'string',
  issuanceType: 'string',

  // HTLC
  htlcStep: 'number',
  secretEncrypted: 'string',
  secret: 'string',   // Revealed secret (after transaction #3)
  hashlock: 'string',
  // HTLC1 timelock:
  timelock: 'number',
  // HTLC2 timelock:
  timelock2: 'number',
  htlcTxId1: 'string',
  htlcTxId2: 'string',
  htlcTxId3: 'string',
  htlcTxId4: 'string',

  description: 'string',

  createdAt: {
    type: 'date',
    serialize: false
  },
  updatedAt: {
    type: 'date',
    serialize: false
  },

  // Computed props:

  get totalPrice () {
    return this.quantity * this.price
  },
  get issuanceTypeDisplay () {
    return Issuance.typesMap[this.issuanceType] || this.issuanceType
  },
  get dateDisplay () {
    return moment(this.createdAt).format('MM/DD @hh:mm a') // 04/29 @3:56 pm
  },
  get dateUpdatedDisplay () {
    return moment(this.updatedAt).format('MM/DD @hh:mm a')
  },
  get dateDisplayShort () {
    return moment(this.createdAt).format('MMM D')
  },
  get dateDisplayFull () {
    return moment(this.createdAt).format('MM/DD/YY @hh:mm a')
  },
  get statusDisplay () {
    return translate(`status${this.statusWithExpiry}`)
  },
  // TODO the calculation of offer expiry should be a timed server process.
  get isExpired () {
    if (this.timelockInfo &&
        ((this.htlcStep === 2 && this.timelockInfo.partialBlocksRemaining === 0) ||
          (this.htlcStep === 3 && this.timelockInfo.fullBlocksRemaining === 0))) {
      return true
    } else {
      return false
    }
  },
  get statusWithExpiry () {
    const status = this.status
    if (status === 'OPEN' || status === 'TRADING') {
      if (this.isExpired) {
        return 'EXPIRED'
      } else {
        return status
      }
    } else {
      return status || 'OPEN'
    }
  },
  get htlcTransactions () {
    const txesByStep = new DefineMap()
    // make sure these vars get recorded by the observation
    const { htlcTxId1, htlcTxId2, htlcTxId3, htlcTxId4 } = this
    this.orderPromise.then(order => {
      const addresses = [
        this.btcAddress,
        this.eqbAddress,
        order.btcAddress,
        order.eqbAddress
      ]
      return Transaction.getList({
        txId: {
          $in: [ htlcTxId1, htlcTxId2, htlcTxId3, htlcTxId4 ]
        },
        address: {'$in': addresses}
      })
    }).then(txes => {
      const txesByTxId = {}
      txes.forEach(tx => {
        txesByTxId[tx.txId] = tx
      });
      [1, 2, 3, 4].forEach(i => {
        txesByStep.set(i, txesByTxId[this['htlcTxId' + i]])
      })
    })
    return txesByStep
  },

  issuancePromise: {
    get () {
      if (this.issuanceId) {
        return Issuance.get({_id: this.issuanceId})
      }
    }
  },
  issuance: {
    Type: Issuance,
    get (val, resolve) {
      if (val) {
        return val
      }
      this.issuancePromise.then(resolve)
    }
  },
  orderPromise: {
    get () {
      if (this.orderId) {
        return Order.get({_id: this.orderId})
      }
    }
  },
  order: {
    Type: Order,
    get (val, resolve) {
      if (val) {
        return val
      }
      if (this.orderId) {
        this.orderPromise.then(resolve)
      }
    }
  },
  // TODO timelockInfo is currently not observable, nor does it change once bound.
  //  This is a problem because it contains "partialBlocksRemaining" and "fullBlocksRemaining",
  //  which are both important for conditional views.  These values should be live and update,
  //  especially once we get block height updating live from the server.
  timelockInfo: {
    get () {
      const timelockInfo = new DefineMap({
        fullDuration: null,
        fullEndAt: null,
        fullBlocksRemaining: null,
        partialDuration: null,
        partialEndAt: null,
        partialBlocksRemaining: null,
        safetyZone: null
      })
      this.timelockInfoPromise.then(info => {
        timelockInfo.assign(info)
      })
      return timelockInfo
    }
  },
  timelockInfoPromise: {
    get () {
      // Read these props synchronously to ensure this promise is regenerated on change
      const htlcTxId1 = this.htlcTxId1
      const htlcTxId2 = this.htlcTxId2
      return this.orderPromise.then(order => {
        const addresses = [
          this.btcAddress,
          this.eqbAddress,
          order.btcAddress,
          order.eqbAddress
        ]
        return Transaction.getList({
          txId: { $in: [htlcTxId1, htlcTxId2] },
          address: {'$in': addresses}
        })
      })
      .then(txes => {
        const step1 = txes.filter(t => t.htlcStep === 1)[0]
        const step2 = txes.filter(t => t.htlcStep === 2)[0]

        const fullDuration = blockTime[step1.currencyType] * step1.timelock
        const fullEndAt = step1.createdAt.getTime() + fullDuration
        const fullBlocksRemaining = Math.max(
          Math.floor((fullEndAt - Date.now()) / blockTime[step1.currencyType]),
          0
        )
        let partialDuration, partialEndAt, partialBlocksRemaining, safetyZone
        if (step2) {
          partialDuration = blockTime[step2.currencyType] * step2.timelock
          partialEndAt = step2.createdAt.getTime() + partialDuration
          partialBlocksRemaining = Math.max(
            Math.floor((partialEndAt - Date.now()) / blockTime[step2.currencyType]),
            0
          )
          safetyZone = fullEndAt - partialEndAt
        }
        return {
          fullDuration,
          fullEndAt,
          fullBlocksRemaining,
          partialDuration,
          partialEndAt,
          partialBlocksRemaining,
          safetyZone
        }
      })
    }
  },
  // Extras:

  isSelected: {
    serialize: false,
    type: 'boolean',
    value: false
  }
})

Offer.List = DefineList.extend('OfferList', {
  '#': Offer,
  selectItem (item) {
    this.forEach(item => {
      item.isSelected = false
    })
    item.isSelected = true
  }
})

Offer.connection = superModel({
  Map: Offer,
  List: Offer.List,
  feathersService: feathersClient.service('/offers'),
  name: 'offer',
  algebra
})

Offer.algebra = algebra

export default Offer
