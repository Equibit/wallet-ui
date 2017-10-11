import DefineMap from 'can-define/map/map'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'

const FormData = DefineMap.extend({
  /**
   * @property {String} type
   * ENUM ('SELL', 'BUY')
   */
  type: 'string',

  portfolio: Portfolio,
  order: Order,
  quantity: 'number',
  error: 'string',
  transactionFee: 0,

  get totalPrice () {
    return this.order && (this.order.price * this.quantity)
  },

  hasFunds: {
    get () {
      return (this.portfolio.balance.cashBtc - this.transactionFee) > 0
    }
  },
  hasEnoughFunds: {
    get () {
      return this.portfolio.hasEnoughFunds(this.totalPrice + this.transactionFee, 'BTC')
    }
  },
  isValid: {
    get () {
      return this.quantity && this.price && this.goodFor
    }
  }
})

export default FormData
