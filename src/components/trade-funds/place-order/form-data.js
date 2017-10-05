import DefineMap from 'can-define/map/map'
import { translate } from '../../../i18n/i18n'
import Issuance from '../../../models/issuance'
import Portfolio from '../../../models/portfolio'

const FormData = DefineMap.extend({
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
  price: 'number',
  isFillOrKill: 'boolean',
  goodFor: 'number',

  get totalPrice () {
    return this.quantity * this.price
  },

  hasFunds: {
    get () {
      return true
      return (this.portfolio.balance[this.fundsType === 'BTC' ? 'cashBtc' : 'cashEqb'] - this.transactionFee) > 0
    }
  },
  hasEnoughFunds: {
    get () {
      return true
      if (this.type === 'FUNDS') {
        return this.portfolio.hasEnoughFunds(this.amount + this.transactionFee, this.fundsType)
      }
      if (this.type === 'SECURITIES' && this.issuance) {
        // Need available shares amount and Empty EQB for the fee:
        return this.issuance.availableAmount >= this.amount && this.portfolio.hasEnoughFunds(this.transactionFee, 'EQB')
      }
    }
  },
  isValid: {
    get () {
      return !this.toAddressError && (this.hasEnoughFunds || this.type === 'SECURITIES') && this.amount > 0
    }
  },
  validate () {
    if (!this.toAddress && !this.toAddressError) {
      this.toAddressError = translate('missingAddress')
    }
  }
})

export default FormData
