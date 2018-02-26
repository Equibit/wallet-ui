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
import './order-offers-accepted.less'
import view from './order-offers-accepted.stache'
import Session from '../../../models/session'
import Order from '../../../models/order'
import Issuance from '../../../models/issuance'
import Offer from '../../../models/offer'
import Transaction from '../../../models/transaction/transaction'
import { createHtlc4 } from '../../../models/transaction/transaction-create-htlc4'
import { dispatchAlertError } from '../../../utils/event-hub'

export const ViewModel = DefineMap.extend({
  order: Order,
  issuance: Issuance,
  offers: Offer.List,
  portfolio: {
    get () {
      return Session.current.portfolios[0]
    }
  },

  isAskFlow: {
    get () {
      return this.order && this.order.type === 'SELL'
    }
  },

  // For collect-asset modal:
  offer: '*',
  tx: '*',
  isModalShown: 'boolean',

  timelocks: {
    get (val, resolve) {
      Promise.all(this.offers.map(offer => offer.timelockInfoPromise)).then(resolve)
    }
  },

  // For demo:
  // offer: {
  //   get () {
  //     const offer = this.offers[0]
  //     offer.htlcStep = 3
  //     return offer
  //   }
  // },

  // HTLC 4:
  // - Ask flow: collect payment
  // - Bid flow: collect securities
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

    // Note: we need EQB change address only for the Bid flow (when collecting locked securities).
    portfolio.getNextAddress(true).then(addrPair => {
      try {
        const txData = createHtlc4(order, offer, portfolio, issuance, secret, addrPair.EQB)
        const tx = new Transaction(txData)
        this.openModal(offer, tx)
      } catch (err) {
        dispatchAlertError(err)
        console.error(err)
      }
    })
  },

  // Confirmation modal:
  openModal (offer, tx) {
    typeforce('Transaction', tx)
    this.offer = offer
    this.tx = tx
    this.isModalShown = false
    this.isModalShown = true
  },

  sendTransaction (description) {
    typeforce('?String', description)

    const offer = this.offer
    const tx = this.tx
    typeforce('Offer', offer)
    typeforce('Transaction', tx)

    return tx.sendForOffer(description, offer)
  }
})

export default Component.extend({
  tag: 'order-offers-accepted',
  ViewModel,
  view
})
