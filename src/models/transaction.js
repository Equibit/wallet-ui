import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import { superModelNoCache } from '~/models/super-model'
import algebra from '~/models/algebra'
import { bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { pick } from 'ramda'
import i18n from '../i18n/i18n'
import Session from './session'

const Transaction = DefineMap.extend('Transaction', {
  makeTransaction (amount, toAddress, txouts, {fee, changeAddr, network, type, currencyType, description}) {
    currencyType = currencyType.toUpperCase()
    const inputs = txouts.map(pick(['txid', 'vout', 'keyPair']))
    const availableAmount = txouts.reduce((acc, a) => acc + a.amount, 0)
    const outputs = [
      {address: toAddress, value: toSatoshi(amount)},
      {address: changeAddr, value: toSatoshi(availableAmount) - toSatoshi(amount) - toSatoshi(fee)}
    ]
    const txInfo = buildTransaction(inputs, outputs, network)

    return new Transaction({
      address: txouts[0].address,
      addressTxid: txouts[0].txid,
      addressVout: txouts[0].vout,
      type,
      currencyType,
      amount,
      description,
      hex: txInfo.hex,
      txIdBtc: currencyType === 'BTC' ? txInfo.txId : undefined,
      txIdEqb: currencyType === 'EQB' ? txInfo.txId : undefined,
      otherAddress: toAddress
    })
  }
}, {
  _id: 'string',

  address: 'string',
  addressTxid: 'string',
  addressVout: 'number',

  otherAddress: 'string',

  type: 'string', // enum: [ 'IN', 'OUT', 'BUY', 'SELL' ]
  typeFormatted: {
    get () {
      const typeString = {
        BUY: i18n['transactionBuy'],
        IN: i18n['transactionIn'],
        OUT: i18n['transactionOut'],
        SELL: i18n['transactionSell']
      }
      return typeString[this.type]
    }
  },
  currencyType: 'string', // enum: [ 'BTC', 'EQB' ]
  companyName: 'string',
  companySlug: 'string',
  issuanceName: 'string',
  issuanceId: 'string',

  txIdBtc: 'string',
  txIdEqb: 'string',

  amount: 'number',
  amountBtc: {
    get () {
      return (Session.current && Session.current.toBTC(this.amount, this.currencyType)) || this.amount
    }
  },
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
    return txId && `http://localhost:3030/proxycore?method=gettransaction&params[]=${txId}&params[]=true`
  }
})

/**
 * @function buildTransaction
 * Builds a signed transaction.
 *
 * @param {Array<Object(txid, vout, keyPair)>} inputs
 * @param {Array<Object(address, value)>} outputs
 * @returns {String} A HEX code of the signed transaction
 */
export function buildTransaction (inputs, outputs, network = bitcoin.networks.testnet) {
  const tx = new bitcoin.TransactionBuilder(network)
  inputs.forEach(({ txid, vout }, index) => tx.addInput(txid, vout))
  outputs.forEach(({address, value}) => tx.addOutput(address, value))
  inputs.forEach(({ keyPair }, index) => tx.sign(index, keyPair))
  console.log('- blockchain transaction: ', tx)
  const builtTx = tx.build()
  return {
    txId: builtTx.getId(),
    hex: builtTx.toHex()
  }
}

function toSatoshi (val) {
  return Math.floor(val * 100000000)
}

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
