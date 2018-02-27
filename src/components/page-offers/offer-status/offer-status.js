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
import route from 'can-route'
import typeforce from 'typeforce'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
// import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'

import { translate } from '../../../i18n/i18n'
import './offer-status.less'
import view from './offer-status.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Issuance from '../../../models/issuance'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import { createHtlc3 } from '../../../models/transaction/transaction-create-htlc3'

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
  date: '*',
  get dateDisplay () {
    return moment(this.date).format('MM/DD @h:mm A')   // 04/29 @2:30 pm
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
    ]).then(([addrPair, transactionFeeRates])=> {
        const txData = createHtlc3(order, offer, portfolio, issuance, secret, addrPair[currencyType], transactionFeeRates.regular)
        const tx = new Transaction(txData)
        this.secret = secret

        this.openModal(tx)
      })
  },

  // Confirmation modal:
  openModal (tx) {
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

    tx.description = description || tx.description
    return tx.save()
      .then(tx => updateOffer(offer, secret, tx))
      .then(({tx}) => dispatchAlert(hub, tx, route))
      .catch(dispatchAlertError)
  }
})

function updateOffer (offer, secret, tx) {
  offer.htlcStep = 3
  // reveal secret to the seller:
  offer.secret = secret
  offer.htlcTxId3 = tx.txId
  return offer.save().then(offer => ({ offer, tx }))
}

function dispatchAlert (hub, tx, route) {
  if (!tx) {
    return
  }
  const url = route.url({ page: 'transactions', itemId: tx._id })
  return hub.dispatch({
    'type': 'alert',
    'kind': 'success',
    'title': translate('tradeWasUpdated'),
    'message': `<a href="${url}">${translate('viewTransaction')}</a>`,
    'displayInterval': 10000
  })
}

export default Component.extend({
  tag: 'offer-status',
  ViewModel,
  view
})
