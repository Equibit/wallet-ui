/**
 * @module {can.Component} components/page-offers/offer-status offer-details > offer-status
 * @parent components.buy-sell-offers 6
 *
 * Shows a detailed status for an offer.
 *
 * @signature `<offer-status />`
 *
 * @link ../src/components/page-offers/offer-status/offer-status.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-status/offer-status.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import typeforce from 'typeforce'
// import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'

import './offer-status.less'
import view from './offer-status.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Issuance from '../../../models/issuance'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import feathersClient from '~/models/feathers-client'

const enumSetter = values => value => {
  if (values.indexOf) {
    if (values.indexOf(value) !== -1) {
      return value
    } else {
      throw Error(`Unexpected enum value ${value}`)
    }
  }
  return value
}

export const ViewModel = DefineMap.extend({
  order: Order,
  offer: Offer,
  issuance: Issuance,
  portfolio: {
    get () {
      return Session.current && Session.current.portfolios && Session.current.portfolios[0]
    }
  },
  get testing () {
    return JSON.stringify(this.offer.htlcTransactions)
  },
  status: {
    set: enumSetter(['OPEN', 'TRADING', 'CLOSED', 'CANCELLED', 'REJECTED'])
  },

  get isAskFlow () {
    return this.order && this.order.type === 'SELL'
  },
  get assetType () {
    return this.order && this.order.assetType
  },

  // For collect-asset modal:
  tx: '*',
  secret: 'string',
  isModalShown: 'boolean',
  isRecoverModalShown: 'boolean',

  titles: {
    get () {
      if (this.tx && this.tx.type === 'REFUND') {
        return {
          BTC: {
            header: 'dealFlowMessageTitleRecoverPayment',
            timer: 'paymentRecoveryTimeLeftDescription',
            button: 'dealFlowMessageTitleCancelAndRecoverPayment'
          },
          EQB: {
            header: 'dealFlowMessageTitleRecoverSecurities',
            timer: 'securitiesRecoveryTimeLeftDescription',
            button: 'dealFlowMessageTitleCancelAndRecoverSecurities'
          }
        }
      }
    }
  },

  isTransactionToUser (tx) {
    const allAddresses = [...Session.current.allAddresses.BTC, ...Session.current.allAddresses.EQB]
    return tx && allAddresses.indexOf(tx.toAddress) > -1
  },

  /**
   * For Ask flow its collecting securities, for Bid flow - collecting payment.
   */
  // HTLC 3:
  // 1. Generate addr for blank EQB (to pay the fee) change.
  // 2. Prepare tx config and create htlc3 transaction.
  // 3. Save offer htlcStep=4 and reveal the secret.
  collectSecurities () {
    const order = this.order
    const offer = this.offer
    const issuance = this.issuance
    const user = Session.current.user
    const portfolio = this.portfolio
    const secret = user.decrypt(offer.secretEncrypted)
    typeforce(typeforce.tuple(
      'Order',
      'Offer',
      '?Issuance',
      'User',
      'Portfolio',
      'String'
    ), [order, offer, issuance, user, portfolio, secret])
    if (order.assetType === 'ISSUANCE') {
      typeforce('Issuance', issuance)
    }

    const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
    return Promise.all([
      portfolio.getNextAddress(),
      Session.current.transactionFeeRatesPromise
    ]).then(([addrPair, transactionFeeRates]) => {
      const tx = Transaction.createHtlc3(order, offer, portfolio, issuance, secret, addrPair[currencyType], transactionFeeRates.regular)
      this.secret = secret

      this.openModal(tx)
    })
  },

  recoverSecurities () {
    const order = this.order
    const offer = this.offer
    const issuance = this.issuance
    const user = Session.current.user
    const portfolio = this.portfolio
    const secret = user.decrypt(offer.secretEncrypted)
    typeforce(typeforce.tuple(
      'Order',
      'Offer',
      'User',
      'Portfolio',
      'String'
    ), [order, offer, user, portfolio, secret])
    if (offer.assetType !== 'EQUIBIT') {
      typeforce('Issuance', issuance)
    }

    const currencyType = order.type === 'SELL' ? 'BTC' : 'EQB'
    return Promise.all([
      portfolio.getNextAddress(),
      Session.current.transactionFeeRatesPromise,
      feathersClient.service('proxycore').find({
        query: {
          node: currencyType.toLowerCase(),
          method: 'getblockchaininfo'
        }
      })
    ]).then(([addrPair, transactionFeeRates, blockchainInfo]) => {
      const tx = Transaction.createHtlcRefund4(
        order,
        offer,
        portfolio,
        issuance,
        secret,
        addrPair[currencyType],
        transactionFeeRates.regular,
        blockchainInfo.result.blocks // <- locktime for next transaction -- if it's not late enough,
                                     //  sending TX will throw "Locktime requirement not satisfied" error
      )
      this.secret = secret

      this.openModal(tx)
    })
  },

  // Confirmation modal:
  openModal (tx, isRecover) {
    typeforce('Transaction', tx)
    this.tx = tx
    this.isModalShown = false
    this.isModalShown = true
  },

  sendTransaction (description) {
    typeforce('?String', description)

    const offer = this.offer
    const tx = this.tx
    const secret = this.secret
    typeforce('Offer', offer)
    typeforce('Transaction', tx)

    return tx.sendForOffer(description, offer, secret)
  }
})

export default Component.extend({
  tag: 'offer-status',
  ViewModel,
  view
})
