import DefineMap from 'can-define/map/map'
import moment from 'moment'
// import { translate } from '../../../i18n/i18n'
import Issuance from '../../../models/issuance'
import Portfolio from '../../../models/portfolio'

const FormData = DefineMap.extend('FormData', {
  /**
   * @property {String} type
   * ENUM ('SELL', 'BUY')
   */
  type: {
    get (val) {
      if (this.authIssuancesOnly) {
        return 'SELL'
      }
      return val || 'SELL'
    }
  },
  portfolio: Portfolio,
  rates: '*',
  issuance: Issuance,
  session: '*',
  authIssuancesOnly: 'boolean',

  quantity: 'number',
  priceInUnits: 'number',
  isFillOrKill: 'boolean',
  goodFor: 'number',

  error: 'string',

  availableAmount: {
    get () {
      return this.issuance && this.issuance.availableAmount
    }
  },

  // Price in Satoshi
  get price () {
    // Currently the unit here is micro bitcoins:
    return this.priceInUnits * 100
  },

  get totalPriceInUnits () {
    return this.quantity * this.priceInUnits
  },

  get totalPrice () {
    // Currently the unit here is micro bitcoins:
    return this.priceInUnits * 100
  },

  get goodUntil () {
    return moment().add(this.goodFor, 'days').format('MMM D')
  },

  hasFunds: {
    get () {
      return this.availableAmount
    }
  },
  hasEnoughFunds: {
    get () {
      if (this.type === 'SELL' && this.quantity) {
        return this.availableAmount >= this.quantity
      }
      return true
    }
  },
  isValid: {
    get () {
      return !!(this.quantity && this.price && this.goodFor && this.hasEnoughFunds)
    }
  }
})

export default FormData
