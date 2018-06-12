/**
 * @module {can-map} models/transaction Transaction
 * @parent models.wallet
 *
 * Transaction model
 *
 * @group models/transaction.properties 0 properties
 *
 *  Blockchain transaction has:
 *  - inputs
 *    - (txid, vout) -> from address
 *  - outputs
 *    - amount, change, fee
 *    - script -> to address
 *
 *  Transaction DB record should contain:
 *  - Main props:
 *    - address (to indicate what user this tx belongs to)
 *    - amount (the amount of the main output)
 *    - txId
 *    - currencyType (BTC, EQB)
 *    - type ('TRADE', 'TRANSFER', 'REFUND', 'AUTH', 'CANCEL')
 *    - fromAddress, toAddress
 *    - fee (if fromAddress === address)
 *    - description
 *  - Trade info:
 *    - offerId, htlcStep, hashlock, timelock, refundAddress
 *    - company info
 *    - issuance info
 *  - Blockchain tx info (not for storing in DB):
 *    - hex, txid, vout
 *  - Other:
 *    - feeRate
 *
 *  Transaction should have a `build` method that could be called multiple times (e.g. change of timelock or transaction fee rate)
 *  - For this it should have access to available UTXO (e.g. portfolio for BTC/EQB or issuance)
 *  - To run build we need to know:
 *    - currencyType, amount, toAddress, htlcStep + info,
 *    - transaction fee rate
 *  - Only the following types can be rebuilt: 'TRANSFER' (if from the user), 'TRADE', 'REFUND', 'AUTH', 'CANCEL'.
 *  - If `_id` is set then we canNOT rebuild (transaction was already sent).
 *
 * Cases to cover:
 *  - Auth issuance with change
 *  - Auth issuance without change
 *  - Send issuance
 *  - Cancel issuance
 *  - Buy or Sell (inc HTLC transactions)
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import route from 'can-route'
import typeforce from 'typeforce'
import feathersClient from '../feathers-client'
import { superModelNoCache } from '../super-model'
import algebra from '../algebra'
import i18n, { translate } from '../../i18n/i18n'
import { makeTransaction } from './transaction-make'
import { createHtlc1 } from './transaction-create-htlc1'
import { createTransfer } from './transaction-transfer'
import { blockTime, testNetTxExplorerUrl } from '~/constants'
import env from '~/environment'
import { buildTransaction } from './transaction-build'
import { eqbTxBuilder } from '@equibit/wallet-crypto/dist/wallet-crypto'
import BlockchainInfo from '../blockchain-info'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
import Session from '~/models/session'
import TransactionNote from './note'
const hashTimelockContract = eqbTxBuilder.hashTimelockContract

let Transaction

const txStaticMethods = [
  makeTransaction, createTransfer, createHtlc1
].reduce((acc, method) => {
  acc[method.name] = function () {
    const txData = method.apply(this, arguments)
    return new Transaction(txData)
  }
  return acc
}, {})

Transaction = DefineMap.extend('Transaction', Object.assign({}, txStaticMethods, {
  // makeTransaction (amount, toAddress, txouts, options) {
  //   const txData = makeTransaction.apply(this, arguments)
  //   return new Transaction(txData)
  // },
  // createHtlc1 (offer, order, portfolio, issuance, changeAddr, transactionFeeRate) {
  //   const txData = createHtlc1.apply(this, arguments)
  //   return new Transaction(txData)
  // },
  subscribe (cb) {
    feathersClient.service('/transactions').on('created', data => {
      console.log('Transaction.on.created', data)
      cb(data)
    })
  },
  unSubscribe () {
    feathersClient.service('/transactions').removeListener('created')
  },
  calculateFee (tx, rates) {
    // TODO: calculate based on the number of inputs/outputs and JSON size for eqb if applied.
    return 10000
  }
}), {
  /**
   * @property {String} models/user.properties._id _id
   * @parent models/user.properties
   * Id of a Transaction record in DB.
   */
  _id: 'string',

  // The following txid and vout are for address validation and won't be stored in DB
  addressTxid: 'string',
  addressVout: 'number',

  /**
   * @property {String} models/transaction.properties.fromAddress fromAddress
   * @parent models/transaction.properties
   * Address of the sender.
   */
  fromAddress: 'string',

  /**
   * @property {String} models/transaction.properties.toAddress toAddress
   * @parent models/transaction.properties
   * Address of the recipient.
   */
  toAddress: 'string',

  /**
   * @property {Enum} models/transaction.properties.type type
   * @parent models/transaction.properties
   * Transaction type. One of: [ 'TRADE', 'TRANSFER', 'REFUND', 'AUTH', 'CANCEL' ]
   */
  type: 'string',

  /**
   * @property {?Enum} models/transaction.properties.assetType assetType
   * @parent models/transaction.properties
   * Asset type for a trade. One of: [ 'ISSUANCE', 'EQUIBIT' ]
   */
  assetType: 'string',

  /**
   * @property {Number} models/transaction.properties.htlcStep htlcStep
   * @parent models/transaction.properties
   * Atomic swap consists of 4 transactions. This indicates current "step".
   */
  htlcStep: 'number',

  /**
   * @property {Number} models/transaction.properties.hashlock hashlock
   * @parent models/transaction.properties
   * Hash of HTLC secret. The corresponding encrypted secret is stored with the Offer.
   * Hashlock is also used to identify all 4 transactions of the same trade.
   */
  hashlock: 'string',

  /**
   * @property {Number} models/transaction.properties.timelock timelock
   * @parent models/transaction.properties
   * Timelock for HTLC (number of blocks, decimal).
   */
  timelock: 'number',

  /**
   * @property {Number} models/transaction.properties.confirmationBlockHeight confirmationBlockHeight
   * @parent models/transaction.properties
   * The block height of the blockchain at the time the transaction was confirmed (for calculating timelocks).
   */
  confirmationBlockHeight: 'number',

  /**
   * @property {String} models/transaction.properties.refundAddress refundAddress
   * @parent models/transaction.properties
   * Refund address for HTLC transaction.
   */
  refundAddress: 'string',

  get typeForUser () {
    const isFromUser = Session.current.allAddresses[this.currencyType].indexOf(this.fromAddress) > -1
    switch (this.type) {
      case 'TRADE':
        if (this.htlcStep < 3) {
          return isFromUser ? 'USER-LOCK' : 'LOCK'
        } else {
          return isFromUser ? 'USER-UNLOCK' : 'UNLOCK'
        }
      case 'TRANSFER':
        return isFromUser ? 'OUT' : 'IN'
      default:
        return this.type
    }
  },

  /**
   * @property {String} models/transaction.properties.typeFormatted typeFormatted
   * @parent models/transaction.properties
   * Getter. Localized human readable type.
   */
  typeFormatted: {
    get () {
      const typeString = {
        IN: i18n['transactionIn'],
        OUT: i18n['transactionOut'],
        LOCK: i18n['transactionLock'],
        'USER-LOCK': i18n['transactionLock'],
        UNLOCK: i18n['transactionUnlock'],
        'USER-UNLOCK': i18n['transactionUnlock'],
        REFUND: i18n['transactionRefund'],
        AUTH: i18n['transactionAuth'],
        CANCEL: i18n['transactionCancel']
      }
      return typeString[this.typeForUser]
    }
  },

  /**
   * @property {String} models/transaction.properties.currencyType currencyType
   * @parent models/transaction.properties
   * Blockchain type: BTC or EQB.
   */
  currencyType: 'string',

  /**
   * @property {String} models/transaction.properties.companyName companyName
   * @parent models/transaction.properties
   * Issuance details
   */
  companyName: 'string',
  companySlug: 'string',
  issuanceId: 'string',
  issuanceName: 'string',
  issuanceType: 'string', // ['Common Shares', 'Bonds', 'Equibit', 'Preferred Shares', 'Partnership Units', 'Trust Units', 'Bitcoin']
  issuanceUnit: 'string', // ['Shares', 'BTC', 'Units']

  /**
   * @property {String} models/transaction.properties.txId txId
   * @parent models/transaction.properties
   * Transaction ID in Bitcoin or Equibit blockchain
   */
  txId: 'string',

  /**
   * @property {String} models/transaction.properties.offerId offerId
   * @parent models/transaction.properties
   * Offer ID in Equibit portfolio (for grouping trade transactions)
   */
  offerId: 'string',

  /**
   * @property {Number} models/transaction.properties.costPerShare costPerShare
   * @parent models/transaction.properties
   * price from the related Offer ID in Equibit portfolio
   * required if offerId is present
   */
  costPerShare: 'number',

  /**
   * @property {Number} models/transaction.properties.amount amount
   * @parent models/transaction.properties
   * Amount in Satoshi
   */
  amount: 'number',

  /**
   * @property {Number} models/transaction.properties.fee fee
   * @parent models/transaction.properties
   * Transaction fee. In Satoshi
   */
  fee: 'number',

  /**
   * @property {String} models/transaction.properties.description description
   * @parent models/transaction.properties
   * Transaction description
   */
  description: {
    get (val, resolve) {
      if (typeof val !== 'undefined') {
        return resolve ? resolve(val) : val
      } else if (!this.isNew()) {
        TransactionNote.getList({
          address: {$in: Session.current.allAddresses[this.currencyType]},
          txId: this.txId
        }).then(result => resolve(result[0] && result[0].description))
      } else {
        // description is undefined
        resolve && resolve()
      }
    }
  },

  // Won't be stored in DB. If a failure occurs the error will be immediately shown to user without creating a DB entry.
  hex: 'string',

  get isPending () {
    return !this.confirmationBlockHeight
  },

  createdAt: { type: 'date', serialize: true }, // serialize for can-connect real time to sort it
  updatedAt: { type: 'date', serialize: false },

  // Extras:
  selected: {
    type: 'boolean',
    serialize: false
  },
  get transactionUrl () {
    const txId = this.txId
    const nodeType = this.currencyType.toLowerCase()
    return txId && `${env.api}/proxycore?node=${nodeType}&method=gettransaction&params[]=${txId}&params[]=true`
  },
  get transactionUrlTestNet () {
    return this.txId && this.currencyType === 'BTC' && testNetTxExplorerUrl(this.txId)
  },
  isSecurity: {
    get () {
      // TODO: this info can be assumed from the metadata data of a raw transaction
      return this.currencyType === 'EQB' && this.companyName
    }
  },
  get amountPlusFee () {
    return (['OUT', 'AUTH', 'USER-LOCK'].indexOf(this.typeForUser) > -1) ? this.amount + this.fee : this.amount
  },
  // TODO: valuate issuance.
  get valuationNow () {
    return this.amount
  },
  get valuationThen () {
    return this.amount
  },
  get issuanceUnitQuantity () {
    return this.amount
  },
  get issuanceTypeDisplay () {
    return this.issuanceType === 'common_shares' ? 'Common Shares' : this.issuanceType
  },
  get timelockExpiresAt () {
    const ctime = this.createdAt ? this.createdAt.getTime() : Date.now()
    return new Date(ctime + (this.timelock || 0) * blockTime[this.currencyType])
  },

  // This is for rebuilding transaction hex:
  buildConfig: {
    type: '*',
    serialize: false
  },
  // Rebuilds transaction hex (e.g. timelock was changed)
  rebuild ({ timelock }) {
    if (this._id) {
      throw new Error('Cannot rebuild transaction because it was already submitted')
    }
    typeforce('Number', timelock)
    if (!this.buildConfig) {
      throw new Error('Cannot rebuild transaction (no build config)')
    }
    if (!this.buildConfig.vout[0].scriptPubKey) {
      throw new Error('Cannot rebuild transaction (no existing vout scriptPubKey)')
    }
    const script = hashTimelockContract(this.toAddress, this.refundAddress, this.hashlock, timelock)
    console.log(`script = ${script.toString('hex')}`)
    this.buildConfig.vout[0].scriptPubKey = script
    const tx = buildTransaction(this.currencyType)(this.buildConfig.vin, this.buildConfig.vout)

    this.timelock = timelock
    this.hex = tx.hex
    this.txId = tx.txId
  },
  sendForOffer (description, offer, secret) {
    typeforce('?String', description)
    typeforce('Offer', offer)

    const title = this.type === 'REFUND'
      ? (offer.htlcStep === 3 ? 'orderCancelled' : 'dealFlowMessageTitleDealCancelled')
      : 'tradeWasUpdated'
    const message = this.type === 'REFUND' ? null : 'viewTransaction'

    this.description = description || this.description
    return this.save()
      .then(tx => updateOffer(offer, tx, secret))
      .then(({tx}) => dispatchAlert(tx, title, message))
      .catch(dispatchAlertError)
  },
  // todo: incompleted...
  build () {
    this.hex = 'hex here'
    this.txId = 'txid here'
  },

  get currentBlockHeight () {
    const blockchainInfo = BlockchainInfo.infoBySymbol()
    return blockchainInfo[this.currencyType] && blockchainInfo[this.currencyType].currentBlockHeight
  },
  // If a transaction is mined it is confirmed (1). Every block on top adds one confirmation.
  get numberOfConfirmations () {
    return this.confirmationBlockHeight &&
      ((this.currentBlockHeight && (this.currentBlockHeight - this.confirmationBlockHeight + 1)) || 1)
  }
})

Transaction.defaultFee = 1000

function updateOffer (offer, tx, secret) {
  const newHtlcStep = ++offer.htlcStep

  // reveal secret to the seller for step 3:
  if (newHtlcStep === 3) {
    offer.secret = secret
  }
  if (tx.type === 'REFUND') {
    offer.status = 'CANCELLED'
  }
  offer['htlcTxId' + newHtlcStep] = tx.txId
  return offer.save().then(offer => ({ offer, tx }))
}

function dispatchAlert (tx, title, message) {
  if (!tx) {
    return
  }
  const url = route.url({ page: 'transactions', itemId: tx._id })
  return hub.dispatch({
    'type': 'alert',
    'kind': 'success',
    'title': translate(title),
    'message': message && `<a href="${url}">${translate(message)}</a>`,
    'displayInterval': 10000
  })
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
}, [
  // option behaviors
  function (baseConnection) {
    return {
      createdInstance (instance, props) {
        // don't wait for balance to refresh because it takes a while
        Session.current.refreshBalance(instance)
        return baseConnection.createdInstance.apply(this, arguments)
      }
    }
  }
])

Transaction.algebra = algebra

export default Transaction
