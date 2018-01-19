/**
 * @module {can.Component} components/page-orders/order-offers-accepted order-details > order-offers-accepted
 * @parent components.buy-sell 7
 *
 * This component shows accepted offers from an order.
 *
 * @signature `<order-offers-accepted />`
 *
 * @link ../src/components/page-orders/order-offers-accepted/order-offers-accepted.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-offers-accepted/order-offers-accepted.html
 */

import typeforce from 'typeforce'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import route from 'can-route'
import './order-offers-accepted.less'
import view from './order-offers-accepted.stache'
import Session from '../../../models/session'
import Order from '../../../models/order'
import Issuance from '../../../models/issuance'
import Offer from '../../../models/offer'
import Transaction from '../../../models/transaction/transaction'
import { createHtlc4 } from '../../../models/transaction/transaction-create-htlc4'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
import { translate } from '../../../i18n/i18n'

export const ViewModel = DefineMap.extend({
  order: Order,
  issuance: Issuance,
  offers: Offer.List,
  portfolio: {
    get () {
      return Session.current.portfolios[0]
    }
  },

  // For collect-asset modal:
  offer: '*',
  tx: '*',
  isModalShown: 'boolean',

  // For demo:
  // offer: {
  //   get () {
  //     const offer = this.offers[0]
  //     offer.htlcStep = 3
  //     return offer
  //   }
  // },

  // HTLC 4:
  // todo: its a BTC transaction for a SELL order. Generalize to check `order.type`.
  collectPayment (offer) {
    const order = this.order
    const issuance = this.issuance
    const user = Session.current.user
    const portfolio = this.portfolio
    const secret = offer.secret
    typeforce(typeforce.tuple(
      'Order',
      'Offer',
      'Issuance',
      'User',
      'Portfolio',
      'String'
    ), [order, offer, issuance, user, portfolio, secret])

    try {
      const txData = createHtlc4(order, offer, portfolio, issuance, secret)
      const tx = new Transaction(txData)
      this.openModal(offer, tx)
    } catch (err) {
      dispatchAlertError(err)
      console.error(err)
    }
  },

  // Confirmation modal:
  openModal (offer, tx) {
    typeforce('Transaction', tx)
    this.offer = offer
    this.tx = tx
    this.isModalShown = false
    this.isModalShown = true
  },

  sendTransaction (args) {
    typeforce('?String', args[1])
    const description = args[1]

    const offer = this.offer
    const tx = this.tx
    typeforce('Offer', offer)
    typeforce('Transaction', tx)

    tx.description = description || tx.description
    return tx.save()
      .then(tx => updateOffer(offer, tx))
      .then(({tx}) => dispatchAlert(hub, tx, route))
      .catch(dispatchAlertError)
  }
})

function updateOffer (offer, tx) {
  offer.htlcStep = 4
  offer.htlcTxId4 = tx.txId
  return offer.save()
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
  tag: 'order-offers-accepted',
  ViewModel,
  view
})
