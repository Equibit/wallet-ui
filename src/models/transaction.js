import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import { superModelNoCache } from '~/models/super-model'
import algebra from '~/models/algebra'
import { bitcoin, eqbTxBuilder } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { pick } from 'ramda'
import i18n from '../i18n/i18n'
// import Session from './session'

/**
 * Cases to cover:
 *  - Auth issuance with change
 *  - Auth issuance without change
 *  - Send issuance
 *  - Cancel issuance
 */

const Transaction = DefineMap.extend('Transaction', {
  makeTransaction (
    amount,
    toAddress,
    txouts,
    {fee, changeAddr, network, type, currencyType, description, issuanceJson, issuanceTxId, issuance, changeAddrEmptyEqb, amountEqb}
  ) {
    currencyType = currencyType.toUpperCase()
    const inputs = txouts.map(pick(['txid', 'vout', 'keyPair']))
    const availableAmount = txouts.reduce((acc, a) => acc + a.amount, 0)
    const outputs = [
      {address: toAddress, value: toSatoshi(amount)}
    ]
    if (changeAddr) {
      outputs.push({address: changeAddr, value: toSatoshi(availableAmount) - toSatoshi(amount) - toSatoshi(fee)})
    } else {
      // Case: cancel issuance with no change address (all issuance inputs will be emptied). Transaction fee is deducted here:
      outputs[0].value -= toSatoshi(fee)
    }
    // Case: auth issuance
    if (issuanceJson) {
      // todo: simplify and check the case where we send all available shares
      if (!issuanceTxId) {
        outputs[0].issuanceJson = issuanceJson
      } else {
        // Case: auth issuance with change:
        outputs[1].issuanceTxId = issuanceTxId
        outputs[1].value = toSatoshi(issuance.availableAmount - amount)
      }
    }
    if (issuanceTxId) {
      outputs[0].issuanceTxId = issuanceTxId
    }
    if (changeAddrEmptyEqb) {
      outputs.push({
        address: changeAddrEmptyEqb,
        value: toSatoshi(amountEqb - fee)
      })
    }
    const txInfo = buildTransaction(currencyType)(inputs, outputs, network)

    const txData = {
      address: txouts[0].address,
      addressTxid: txouts[0].txid,
      addressVout: txouts[0].vout,
      fee,
      type,
      currencyType,
      amount,
      description,
      hex: txInfo.hex,
      txIdBtc: currencyType === 'BTC' ? txInfo.txId : undefined,
      txIdEqb: currencyType === 'EQB' ? txInfo.txId : undefined,
      otherAddress: toAddress
    }

    // add issuance details:
    if (issuance) {
      txData.companyName = issuance.companyName
      txData.companySlug = issuance.companySlug
      txData.issuanceId = issuance._id
      txData.issuanceName = issuance.issuanceName
      txData.issuanceType = issuance.issuanceType
      txData.issuanceUnit = issuance.issuanceUnit
    }

    return new Transaction(txData)
  },
  subscribe (cb) {
    feathersClient.service('/transactions').on('created', (data) => {
      console.log('subscribe', arguments)
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

export const buildTransaction = currencyType => {
  return currencyType === 'BTC' ? buildTransactionBtc : buildTransactionEqb
}

/**
 * @function buildTransactionBtc
 * Builds a signed transaction.
 *
 * @param {Array<Object(txid, vout, keyPair)>} inputs
 * @param {Array<Object(address, value)>} outputs
 * @returns {String} A HEX code of the signed transaction
 */
export const buildTransactionBtc = (inputs, outputs, network = bitcoin.networks.testnet) => {
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

export const buildTransactionEqb = (inputs, outputs, network = bitcoin.networks.testnet) => {
  const vout = outputs.map(vout => {
    vout.equibit = {
      // TODO: pass payment currency type here.
      payment_currency: 0,
      payment_tx_id: '',
      issuance_tx_id: (vout.issuanceTxId ? vout.issuanceTxId : '0000000000000000000000000000000000000000000000000000000000000000'),
      issuance_json: (vout.issuanceJson ? JSON.stringify(vout.issuanceJson) : '')
    }
    delete vout.issuanceJson
    return vout
  })
  const tx = {
    version: 2,
    locktime: 0,
    vin: inputs,
    vout
  }
  const bufferTx = eqbTxBuilder.builder.buildTx(tx)
  const hex = bufferTx.toString('hex')
  const txId = eqbTxBuilder.getTxId(bufferTx)
  console.log(`[buildTransactionEqb] hex = ${hex}, \ntxid = ${txId}`)

  return {
    txId,
    hex
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
