import DefineMap from 'can-define/map/map'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'
import Issuance from '../../../models/issuance'
import { toMaxPrecision } from '../../../utils/formatter'

const FormData = DefineMap.extend('OfferFormData', {
  portfolio: Portfolio,
  order: Order,
  issuance: Issuance,
  quantity: {
    type: 'number',
    value: 0,
    get (val) {
      if (this.order.isFillOrKill) {
        return this.order.quantity
      }
      return val
    }
  },
  get uBtcPrice () {
    // Price in order is in Satoshi:
    return (this.order && toMaxPrecision(this.order.price / 100, 2)) || 0
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

  // In uBTC:
  get uBtcTotalPrice () {
    return this.uBtcPrice * this.quantity
  },

  // In Satoshi:
  get totalPrice () {
    return Math.floor(this.uBtcTotalPrice * 100)
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
