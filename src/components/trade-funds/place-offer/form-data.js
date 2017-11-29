import DefineMap from 'can-define/map/map'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'

const FormData = DefineMap.extend('OfferFormData', {
  /**
   * @property {String} type
   * ENUM ('SELL', 'BUY')
   */
  type: 'string',

  portfolio: Portfolio,
  order: Order,
  quantity: {
    type: 'number',
    get (val) {
      if (this.order.isFillOrKill) {
        return this.order.quantity
      }
      return val
    }
  },
  error: 'string',
  transactionFee: {
    type: 'number',
    value: 0
  },

  get totalPrice () {
    return this.order && (this.order.price * this.quantity)
  },

  hasFunds: {
    get () {
      return (this.portfolio.balance.cashBtc - this.transactionFee) > 0
    }
  },
  hasEnoughFunds: {
    // todo: for SELL offer we should check securities
    get () {
      return this.portfolio.hasEnoughFunds(this.totalPrice + this.transactionFee, 'BTC')
    }
  },
  isValid: {
    get () {
      return !!this.quantity
    }
  }
})

export default FormData
