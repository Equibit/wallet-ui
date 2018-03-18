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
import moment from 'moment'
import typeforce from 'typeforce'
// import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'

import './offer-status.less'
import view from './offer-status.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Issuance from '../../../models/issuance'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import { createHtlc3, createHtlcRefund3 } from '../../../models/transaction/transaction-create-htlc3'

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
      return Session.current.portfolios[0]
    }
  },
  status: {
    set: enumSetter(['OPEN', 'TRADING', 'CLOSED', 'CANCELLED', 'REJECTED'])
  },

  isAskFlow: {
    get () {
      return this.order && this.order.type === 'SELL'
    }
  },

  // For collect-asset modal:
  tx: '*',
  secret: 'string',
  isModalShown: 'boolean',
  isRecoverModalShown: 'boolean',

  titles: {
    get () {
      if (this.tx.type === 'CANCEL') {
        return {
          BTC: {
            header: 'dealFlowMessageTitleCollectPayment',
            timer: '',
            button: 'dealFlowMessageTitleCollectAndCloseDeal'
          },
          EQB: {
            header: 'dealFlowMessageTitleCollectSecurities',
            timer: '',
            button: 'dealFlowMessageTitleCollectSecurities'
          }
        }
      }
    }
  },

  /**
   * For Ask flow its collecting securities, for Bid flow - collecting payment.
   */
  // HTLC 3:
  // 1. Generate addr for empty EQB (to pay the fee) change.
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
      'Issuance',
      'User',
      'Portfolio',
      'String'
    ), [order, offer, issuance, user, portfolio, secret])

    const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
    return Promise.all([
      portfolio.getNextAddress(),
      Session.current.transactionFeeRatesPromise
    ]).then(([addrPair, transactionFeeRates]) => {
      const txData = createHtlc3(order, offer, portfolio, issuance, secret, addrPair[currencyType], transactionFeeRates.regular)
      const tx = new Transaction(txData)
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
      'Issuance',
      'User',
      'Portfolio',
      'String'
    ), [order, offer, issuance, user, portfolio, secret])

    const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
    return Promise.all([
      portfolio.getNextAddress(),
      Session.current.transactionFeeRatesPromise
    ]).then(([addrPair, transactionFeeRates]) => {
      const txData = createHtlcRefund3(order, offer, portfolio, issuance, secret, addrPair[currencyType], transactionFeeRates.regular)
      const tx = new Transaction(txData)
      this.secret = secret

      this.openRecoverModal(tx)
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
