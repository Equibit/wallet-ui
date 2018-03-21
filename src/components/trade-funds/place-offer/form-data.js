import DefineMap from 'can-define/map/map'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'
import Issuance from '../../../models/issuance'

const FormData = DefineMap.extend('OfferFormData', {
  portfolio: Portfolio,
  order: Order,
  issuance: Issuance,
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
    value: 1000
  },
  description: 'string',
  timelock: {
    type: 'number',
    value: 72 // 72 blocks ~= 12 hours on the BTC blockchain
  },

  get flowType () {
    return this.order.type === 'SELL' ? 'Ask' : 'Bid'
  },

  get currencyType () {
    return this.order.type === 'SELL' ? 'BTC' : 'EQB'
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
      if (this.currencyType === 'BTC') {
        return this.portfolio.hasEnoughFunds(this.totalPrice + this.fee, 'BTC')
      } else {
        return this.issuance.utxoAmountTotal >= this.quantity && this.portfolio.hasEnoughFunds(this.fee, 'EQB')
      }
    }
  },
  isValid: {
    get () {
      return !!this.quantity && this.hasEnoughFunds
    }
  },
  get errorMessage () {
    return this.currencyType === 'BTC' ? 'Not enough funds' : 'Not enough securities'
  }
})

export default FormData
