/**
 * @module {can-map} models/order Order
 * @parent models.auth
 *
 * Order for buy or sell securities
 *
 * @group models/order.properties 0 properties
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import { superModelNoCache as superModel } from './super-model'
import algebra from './algebra'
import Issuance from './issuance'
import Portfolio from './portfolio'
import moment from 'moment'
import { translate } from '../i18n/i18n'
import Offer from './offer'

const Order = DefineMap.extend('Order', {
  subscribe (cb) {
    feathersClient.service('/orders').on('created', cb)
  },
  unSubscribe (cb) {
    feathersClient.service('/orders').removeListener('created', cb)
  },
  subscribeUpdated (cb) {
    feathersClient.service('/orders').on('updated', cb)
  },
  unSubscribeUpdated (cb) {
    feathersClient.service('/orders').removeListener('updated', cb)
  }
}, {
  _id: 'string',

  /**
   * @property {Number} models/order.properties.userId userId
   * @parent models/order.properties
   * Id of the user this order belongs to
   */
  userId: 'string',

  /**
   * @property {Number} models/order.properties.issuanceId issuanceId
   * @parent models/order.properties
   * Id of the issuance
   */
  issuanceId: 'string',

  /**
   * @property {Number} models/order.properties.issuanceAddress issuanceAddress
   * @parent models/order.properties
   * Public address of the issuance for the order
   */
  issuanceAddress: 'string',

  /**
   * @property {Number} models/order.properties.type type
   * @parent models/order.properties
   * Type of the order. Enum (SELL | BUY).
   */
  type: 'string',

  /**
   * @property {Number} models/offer.properties.assetType assetType
   * @parent models/offer.properties
   * Type of the offer. Enum (ISSUANCE | EQUIBIT).
   */
  assetType: { type: 'string', default: 'ISSUANCE' },

  // For HTLC we need 2 or 3 addresses:
  // - Sell order:
  //    1. btcAddress for receiving payment from a buyer.
  //    2. eqbAddress for a refund.
  // - Buy order:
  //    1. eqbAddress for receiving securities from a seller.
  //    2. btcAddress for our own refund.
  htlcStep: 'number',
  btcAddress: 'string',
  eqbAddress: 'string',

  /**
   * @property {Number} models/order.properties.portfolioId portfolioId
   * @parent models/order.properties
   * Id of a portfolio for buy/sell issuances
   */
  portfolioId: 'string',

  /**
   * @property {Number} models/order.properties.portfolioId fundsPortfolioId
   * @parent models/order.properties
   * Id of a portfolio where funds will be added to / deducted from
   */
  fundsPortfolioId: 'string',

  /**
   * @property {Number} models/order.properties.quantity quantity
   * @parent models/order.properties
   * Quantity of units of the issuance in satoshi EQB
   */
  quantity: 'number',

  /**
   * @property {Number} models/order.properties.price price
   * @parent models/order.properties
   * Price of one unit of the issuance, in satoshi BTC
   */
  price: 'number',

  // ENUM ('OPEN', 'TRADING', 'CANCELLED', 'CLOSED')
  status: {
    type: 'string',
    value: 'OPEN'
  },

  /**
   * @property {Number} models/order.properties.isFillOrKill isFillOrKill
   * @parent models/order.properties
   * Whether the order allows partials or not (True === does not allow partials).
   */
  isFillOrKill: 'boolean',

  /**
   * @property {Number} models/order.properties.goodFor goodFor
   * @parent models/order.properties
   * Period during which the order is valid, in seconds (UI will show it in days)
   */
  goodFor: 'number',

  companyName: 'string',
  issuanceName: 'string',
  issuanceType: 'string',

  createdAt: {
    type: 'date',
    serialize: false
  },
  updatedAt: {
    type: 'date',
    serialize: false
  },

  acceptedOfferIds: Array,

  //
  // Computed props:
  //

  /**
   * @property {Number} models/order.properties.totalPrice totalPrice
   * @parent models/order.properties
   * Total price, quantity * askPrice, in satoshi BTC
   */
  totalPrice: {
    get () {
      return this.quantity * this.price
    }
  },
  get issuanceTypeDisplay () {
    return Issuance.typesMap[this.issuanceType] || this.issuanceType
  },
  get dateDisplay () {
    return moment(this.createdAt).add(this.goodFor, 'days').format('MMM D')
  },
  get statusDisplay () {
    return translate(`status${this.statusWithExpiry}`)
  },
  get statusWithExpiry () {
    return this.status
  },
  get goodForSec () {
    return this.goodFor * 24 * 3600
  },
  get goodUntil () {
    return moment(this.createdAt).add(this.goodFor, 'days').format('MMM D')
  },

  //
  // Related models:
  // (Note: async getters are useful only for stache templates.)
  //

  issuancePromise: {
    get () {
      if (typeof this.issuanceId !== 'undefined') {
        return Issuance.get({_id: this.issuanceId})
      }
    }
  },
  issuance: {
    get (val, resolve) {
      if (this.issuancePromise) {
        this.issuancePromise.then(resolve)
      }
      return val
    }
  },
  portfolio: {
    get (val, resolve) {
      if (typeof this.portfolioId !== 'undefined') {
        Portfolio.get({_id: this.portfolioId}).then(resolve)
      }
      return val
    }
  },
  fundsPortfolio: {
    get (val, resolve) {
      if (typeof this.fundsPortfolioId !== 'undefined') {
        Portfolio.get({_id: this.fundsPortfolioId}).then(resolve)
      }
      return val
    }
  },
  // todo: do we need this at all?
  acceptedOffers: {
    get (val, resolve) {
      const acceptedOfferIds = this.acceptedOfferIds
      if (acceptedOfferIds && acceptedOfferIds.length > 0) {
        const offerPromises = acceptedOfferIds.map(id => Offer.get({_id: id}))
        Promise.all(offerPromises).then(results => resolve(new Offer.List(results)))
      }
      return val
    }
  },

  //
  // Extras:
  //

  isValid: {
    get () {
      return this.portfolioId && this.fundsPortfolioId && this.quantity && this.goodFor
    }
  },
  isSelected: {
    serialize: false,
    type: 'boolean',
    value: false
  },

  marketWidth: {
    serialize: false,
    type: 'number'
  },

  // For BitMessage payload.
  // {"quantity": 5000,"price": "0.333","fill_or_kill": "no","duration": 86400}
  getMessagePayload () {
    return {
      quantity: this.quantity,
      price: this.price,
      fill_or_kill: this.isFillOrKill ? 'yes' : 'no',
      duration: this.goodForSec
    }
  }
})

Order.List = DefineList.extend('OrderList', {
  '#': Order,
  selectItem (item) {
    this.forEach(item => {
      item.isSelected = false
    })
    item.isSelected = true
  }
})

Order.connection = superModel({
  Map: Order,
  List: Order.List,
  feathersService: feathersClient.service('/orders'),
  name: 'order',
  algebra
})

Order.algebra = algebra

export default Order
