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
  authIssuancesOnly: 'boolean',

  quantity: 'number',
  priceInUnits: 'number',
  isFillOrKill: 'boolean',
  goodFor: 'number',

  error: 'string',

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
      return true
      // return (this.portfolio.balance[this.fundsType === 'BTC' ? 'cashBtc' : 'cashEqb'] - this.transactionFee) > 0
    }
  },
  hasEnoughFunds: {
    get () {
      return true
      // if (this.type === 'FUNDS') {
      //   return this.portfolio.hasEnoughFunds(this.amount + this.transactionFee, this.fundsType)
      // }
      // if (this.type === 'SECURITIES' && this.issuance) {
      //   // Need available shares amount and Empty EQB for the fee:
      //   return this.issuance.availableAmount >= this.amount && this.portfolio.hasEnoughFunds(this.transactionFee, 'EQB')
      // }
    }
  },
  isValid: {
    get () {
      return this.quantity && this.price && this.goodFor
    }
  }
})

export default FormData
