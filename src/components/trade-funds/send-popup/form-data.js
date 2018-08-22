import DefineMap from 'can-define/map/map'
import validators from '../../../utils/validators'
import { toMaxPrecision } from '../../../utils/formatter'
import { translate } from '../../../i18n/i18n'
import Issuance from '../../../models/issuance'
import Portfolio from '../../../models/portfolio'

const FormData = DefineMap.extend({
  /**
   * @property {String} type
   * ENUM ('ISSUANCE', 'FUNDS')
   */
  type: {
    get (val) {
      if (this.issuanceOnly) {
        return 'ISSUANCE'
      }
      if (this.fundsOnly) {
        return 'FUNDS'
      }
      return val
    }
  },

  /**
   * @property {String} fundsType
   * ENUM ('EQB', 'BTC')
   */
  fundsType: {
    type: 'string',
    value: 'EQB',
    get (val) {
      if (this.type === 'ISSUANCE') {
        return 'EQB'
      }
      return val
    }
  },
  portfolio: Portfolio,
  rates: '*',
  issuance: Issuance,
  issuanceOnly: 'boolean',
  fundsOnly: 'boolean',

  // todo: calculate price in a getter instead of currency-converter?
  // Note: The price is set by currency-converter component.
  price: 'number',

  description: 'string',

  toAddress: {
    type: 'string',
    set (val) {
      this.toAddressError = validators.bitcoinAddress(val)
      return val
    }
  },
  toAddressError: 'string',

  // In BTC/EQB
  amountCoin: {
    type: 'number',
    value: 0,
    set (val) {
      return toMaxPrecision(val, 8)
    }
  },
  quantity: {
    // two way conversion b/w quantity and securities:
    set (val) {
      Math.round(val)
      this.securities = val
      return val
    },
    get (val) {
      return Math.round(this.amountCoin * 100000000)
    }
  },
  securities: {
    value: 0,
    set (val) {
      this.amountCoin = val / 100000000
      return val
    }
  },
  hasFunds: {
    get () {
      return (this.portfolio.balance[this.fundsType === 'BTC' ? 'cashBtc' : 'cashEqb'] - this.transactionFee) > 0
    }
  },
  hasEnoughFunds: {
    get () {
      if (this.type === 'FUNDS') {
        return this.portfolio.hasEnoughFunds(this.totalAmount, this.fundsType)
      }
      if (this.type === 'ISSUANCE' && this.issuance) {
        // Need available shares amount and Empty EQB for the fee:
        return this.issuance.availableAmount >= this.quantity && this.portfolio.hasEnoughFunds(this.transactionFee, 'EQB')
      }
    }
  },
  hasEnoughEqbFee: {
    get () {
      // Need Empty EQB for the fee:
      return this.portfolio.hasEnoughFunds(this.transactionFee, 'EQB')
    }
  },
  transactionFee: {
    type: 'number',
    // todo: calculate fee
    value: 1000
  },
  isDefaultFee: {
    type: Boolean,
    value: true
  },
  totalAmount: {
    get () {
      return this.isDefaultFee ? this.quantity : this.quantity + this.transactionFee
    }
  },
  sharesToEqb: {
    get () {
      return {
        rate: 1 / (100 * 1000 * 1000),
        symbol: 'EQB'
      }
    }
  },
  isValid: {
    get () {
      return !this.toAddressError && (this.hasEnoughFunds || this.type === 'ISSUANCE') && this.amountCoin > 0
    }
  },
  validate () {
    if (!this.toAddress && !this.toAddressError) {
      this.toAddressError = translate('missingAddress')
    }
  }
})

export default FormData
