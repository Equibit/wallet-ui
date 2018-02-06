import DefineMap from 'can-define/map/map'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'

const FormData = DefineMap.extend('OfferFormData', {
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
  fee: {
    type: 'number',
    value: 100
  },
  description: 'string',
  timelock: {
    type: 'number',
    value: 72 // 72 blocks ~= 12 hours on the BTC blockchain
  },

  get totalPrice () {
    return this.order ? (this.order.price * this.quantity) : 0
  },

  get totalPriceWithFee () {
    return this.totalPrice + this.fee
  },

  hasFunds: {
    get () {
      return (this.portfolio.balance.cashBtc - this.fee) > 0
    }
  },
  hasEnoughFunds: {
    // todo: for SELL offer we should check securities
    get () {
      return this.portfolio.hasEnoughFunds(this.totalPrice + this.fee, 'BTC')
    }
  },
  isValid: {
    get () {
      return !!this.quantity
    }
  }
})

export default FormData
