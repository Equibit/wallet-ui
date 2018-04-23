import DefineMap from 'can-define/map/map'
import moment from 'moment'
// import { translate } from '../../../i18n/i18n'
import Issuance from '../../../models/issuance'
import Portfolio from '../../../models/portfolio'
import feathersClient from '~/models/feathers-client'
import {translate} from '~/i18n/'

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
  assetType: {
    type: 'string',
    get (val) {
      return val || 'ISSUANCE'
    }
  },
  portfolio: Portfolio,
  rates: '*',
  issuance: Issuance,
  session: '*',
  authIssuancesOnly: 'boolean',

  quantity: 'number',

  // For blank EQB we show quantity in EQB for flexible conversion to BTC.
  quantityInCoins: {
    type: 'number',
    // Currently in uEQB. Set quantity which is in Satoshi:
    set (val) {
      this.quantity = Math.floor(val * 100000000)
      return val
    }
  },

  // Note: Currently in uBTC.
  priceInUnits: {
    type: 'number',
    set (newVal) {
      return parseFloat(parseFloat(newVal, 10).toFixed(2), 10)
    }
  },
  isFillOrKill: 'boolean',
  goodFor: 'number',

  error: 'string',

  availableAmount: {
    get () {
      return (this.issuance && this.issuance.availableAmount) ||
        (this.type === 'SELL' && this.assetType === 'EQUIBIT' && this.portfolio.availableAmount('EQB'))
    }
  },

  // Price in Satoshi
  get price () {
    // Currently the unit here is micro bitcoins:
    return this.priceInUnits * 100
  },

  // Note:
  // - For issuances we use Ask Price per issuance share (per 1 Satoshi unit).
  // - For blank EQB we use Ask Price per EQB (N uBTC per 1 EQB).
  get totalPriceInUnits () {
    return this.assetType === 'EQUIBIT'
      ? this.quantityInCoins * this.priceInUnits
      : this.quantity * this.priceInUnits
  },

  get totalPrice () {
    // Currently the unit here is micro bitcoins:
    return this.priceInUnits * 100
  },

  get goodUntil () {
    return moment().add(this.goodFor, 'days').format('MMM D')
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
      return Promise.reject(new Error(translate('sellingSecuritiesCannotQuery')))
    }

    const ordersService = feathersClient.service('orders')

    // query for orders
    const query = {
      issuanceId,
      userId,
      type: 'SELL',
      status: { $in: ['OPEN', 'TRADING'] }
    }

    const promises = Promise.all([
      ordersService.find({ query })
    ]).then(response => {
      const sellIssuanceData = {}
      sellIssuanceData.sellOrderTotal = response[0].data.reduce((total, obj) => total + (obj.quantity || 0), 0)
      sellIssuanceData.maxSellQuantity = issuance.utxoAmountTotal - sellIssuanceData.sellOrderTotal
      this.sellData = sellIssuanceData
      return this.sellData
    })

    return promises
  },

  quantityProblem: 'string',
  get quantityIsVaild () {
    // Ignore this validation for blank EQB.
    if (this.assetType === 'EQUIBIT') {
      return true
    }

    const type = this.type
    const quantity = this.quantity || 0
    const issuance = this.issuance || {}
    const sharesAuthorized = issuance.sharesAuthorized || 0
    this.quantityProblem = ''

    if (type === 'BUY' && quantity > sharesAuthorized) {
      this.quantityProblem = translate('sellingSecuritiesQuantityGTSharesAuthorized')
      return false
    }
    if (type === 'BUY') {
      return true
    }
    // else type === 'SELL'

    const sellDataPromise = this.sellDataPromise
    const sellData = sellDataPromise && this.sellData

    if (!sellData) {
      this.quantityProblem = translate('sellingSecuritiesCheckingSellData')
      // waiting for sellData info
      return false
    }

    if (quantity > sellData.maxSellQuantity) {
      this.quantityProblem = translate('sellingSecuritiesQuantityGTSharesOwned')
      // can't sell more than owned (that are not pending)
      return false
    }

    return true
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
      return !!(this.quantity && this.price && this.goodFor && this.hasEnoughFunds && this.quantityIsVaild)
    }
  }
})

export default FormData
