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
import superModel from './super-model'
import algebra from './algebra'
import Issuance from './issuance'
import Portfolio from './portfolio'
import moment from 'moment'
import { translate } from '../i18n/i18n'

const Offer = DefineMap.extend('Offer', {
  _id: 'string',

  /**
   * @property {Number} models/offer.properties.userId userId
   * @parent models/offer.properties
   * Id of the user this offer belongs to
   */
  userId: 'string',

  /**
   * @property {Number} models/offer.properties.issuanceAddress issuanceAddress
   * @parent models/offer.properties
   * Public address of the issuance for the offer
   */
  issuanceAddress: 'string',

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
    type: 'string',
    value: 'OPEN'
  },

  // Issuance info:
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

  // Computed props:

  get totalPrice () {
    return this.quantity * this.price
  },
  get issuanceTypeDisplay () {
    return Issuance.typesMap[this.issuanceType] || this.issuanceType
  },
  get dateDisplay () {
    return moment(this.createdAt).format('MMM D')
  },
  get statusDisplay () {
    return translate(`status${this.status}`)
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
