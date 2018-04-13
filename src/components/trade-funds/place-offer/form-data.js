import DefineMap from 'can-define/map/map'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'
import Issuance from '../../../models/issuance'
import { toMaxPrecision } from '../../../utils/formatter'
import feathersClient from '~/models/feathers-client'

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

  sellData: '*',
  _sellDataPromise: '*',
  get sellDataPromise () {
    const prom = this._sellDataPromise
    if (prom) {
      return prom
    }
    const issuance = this.issuance || {}
    const issuanceId = issuance._id
    const portfolio = this.portfolio || {}
    const userId = portfolio.userId

    if (!issuanceId || !userId) {
      return Promise.reject(new Error('Cannot Query data for selling issuance'))
    }

    const ordersService = feathersClient.service('orders')
    const offersService = feathersClient.service('offers')

    // query for offers and/or orders
    const query = {
      issuanceId,
      userId,
      type: 'SELL',
      // TODO: not expired
      status: { $in: ['OPEN', 'TRADING'] }
    }

    const promises = Promise.all([
      ordersService.find({ query }),
      offersService.find({ query })
    ]).then(response => {
      const sellIssuanceData = {}
      sellIssuanceData.sellOrderTotal = response[0].data.reduce((total, obj) => total + (obj.quantity || 0), 0)
      sellIssuanceData.sellOfferTotal = response[1].data.reduce((total, obj) => total + (obj.quantity || 0), 0)
      sellIssuanceData.maxSellQuantity = issuance.utxoAmountTotal - sellIssuanceData.sellOrderTotal - sellIssuanceData.sellOfferTotal
      this.sellData = sellIssuanceData
      return this.sellData
    })

    return promises
  },

  quantityProblem: 'string',
  get quantityIsVaild () {
    // Ignore this validation for blank EQB.
    if (this.order.assetType === 'EQUIBIT') {
      return true
    }

    const type = this.type
    const quantity = this.quantity || 0
    const order = this.order || {}
    const orderQuantity = order.quantity || 0
    this.quantityProblem = ''

    if (type === 'BUY' && quantity > orderQuantity) {
      this.quantityProblem = 'Quantity cannot be more than the number of shares ordered.'
      return false
    }
    if (type === 'BUY') {
      return true
    }
    // else type === 'SELL'

    const sellDataPromise = this.sellDataPromise
    const sellData = sellDataPromise && this.sellData

    if (!sellData) {
      this.quantityProblem = 'checking sell data...'
      // waiting for sellData info
      return false
    }

    if (quantity > sellData.maxSellQuantity) {
      this.quantityProblem = 'Quantity cannot be more than the number of shares owned and not trading.'
      // can't sell more than owned (that are not pending)
      return false
    }

    return true
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
      return !!(this.quantity && this.hasEnoughFunds && this.quantityIsVaild)
    }
  },
  get errorMessage () {
    return this.currencyType === 'BTC' ? 'Not enough funds' : 'Not enough securities'
  }
})

export default FormData
