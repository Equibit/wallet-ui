import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import { superModelNoCache } from './super-model'
import algebra from './algebra'
import i18n from '../i18n/i18n'
// import Session from './session'
import {
  makeTransaction,
  makeHtlc
} from './transaction-utils'

/**
 * Cases to cover:
 *  - Auth issuance with change
 *  - Auth issuance without change
 *  - Send issuance
 *  - Cancel issuance
 */

const Transaction = DefineMap.extend('Transaction', {
  makeTransaction (amount, toAddress, txouts, options) {
    const txData = makeTransaction.apply(this, arguments)
    return new Transaction(txData)
  },
  makeHtlc (amount, toAddressA, toAddressB, hashlock, timelock, txouts, options) {
    const txData = makeHtlc.apply(this, arguments)
    return new Transaction(txData)
  },
  subscribe (cb) {
    feathersClient.service('/transactions').on('created', data => {
      console.log('Transaction.on.created', data)
      cb(data)
    })
  },
  unSubscribe () {
    feathersClient.service('/transactions').removeListener('created')
  },
  calculateFee (tx) {
    // TODO: calculate based on the number of inputs/outputs and JSON size for eqb if applied.
    return 10000
  }
}, {
  _id: 'string',

  address: 'string',
  addressTxid: 'string',
  addressVout: 'number',

  otherAddress: 'string',

  type: 'string', // enum: [ 'IN', 'OUT', 'BUY', 'SELL', 'AUTH', 'CANCEL' ]
  typeFormatted: {
    get () {
      const typeString = {
        BUY: i18n['transactionBuy'],
        IN: i18n['transactionIn'],
        OUT: i18n['transactionOut'],
        SELL: i18n['transactionSell'],
        AUTH: i18n['transactionAuth'],
        CANCEL: i18n['transactionCancel']
      }
      return typeString[this.type]
    }
  },
  currencyType: 'string', // enum: [ 'BTC', 'EQB' ]
  confirmations: 'number',

  companyName: 'string',
  companySlug: 'string',
  issuanceId: 'string',
  issuanceName: 'string',
  issuanceType: 'string', // ['Common Shares', 'Bonds', 'Equibit', 'Preferred Shares', 'Partnership Units', 'Trust Units', 'Bitcoin']
  issuanceUnit: 'string', // ['Shares', 'BTC', 'Units']

  txIdBtc: 'string',
  txIdEqb: 'string',

  amount: 'number',
  // amountBtc: {
  //   get () {
  //     return (Session.current && Session.current.toBTC(this.amount, this.currencyType)) || this.amount
  //   }
  // },
  fee: 'number',
  description: 'string',

  // Won't be stored in DB. If a failure occurs the error will be immediately shown to user without creating a DB entry.
  hex: 'string',

  isPending: 'boolean',
  createdAt: { type: 'date', serialize: false },
  updatedAt: { type: 'date', serialize: false },

  // Extras:
  selected: {
    type: 'boolean',
    serialize: false
  },
  get transactionUrl () {
    const txId = this.txIdBtc || this.txIdEqb
    const nodeType = this.txIdBtc ? 'btc' : 'eqb'
    return txId && `http://localhost:3030/proxycore?node=${nodeType}&method=gettransaction&params[]=${txId}&params[]=true`
  },
  isSecurity: {
    get () {
      // TODO: this info can be assumed from the metadata data of a raw transaction
      return this.currencyType === 'EQB' && this.companyName
    }
  },
  get amountPlusFee () {
    return (this.type === 'OUT' || this.type === 'AUTH') ? this.amount + this.fee : this.amount
  },
  // TODO: valuate issuance.
  get valuationNow () {
    return this.amount
  },
  get valuationThen () {
    return this.amount
  },
  get issuanceUnitQuantity () {
    return this.amount * 100000000
  },
  get issuanceTypeDisplay () {
    return this.issuanceType === 'common_shares' ? 'Common Shares' : this.issuanceType
  }
})

Transaction.List = DefineList.extend('TransactionList', {
  '#': Transaction
})

Transaction.connection = superModelNoCache({
  Map: Transaction,
  List: Transaction.List,
  feathersService: feathersClient.service('/transactions'),
  name: 'transactions',
  algebra
})

Transaction.algebra = algebra

export default Transaction
