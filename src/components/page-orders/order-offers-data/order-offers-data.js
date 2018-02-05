/**
 * @module {can.Component} wallet-ui/components/page-orders/order-offers-data order-details > order-offers-data
 * @parent components.buy-sell 8
 *
 * This component shows the list of offers available for an order using an accordion style container.
 *
 * @signature `<order-offers-data />`
 *
 * @link ../src/components/page-orders/order-offers-data/order-offers-data.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-offers-data/order-offers-data.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import route from 'can-route'
import typeforce from 'typeforce'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
import './order-offers-data.less'
import view from './order-offers-data.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Issuance from '../../../models/issuance'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import { createHtlc2 } from '../../../models/transaction/transaction-create-htlc2'
import { translate } from '../../../i18n/i18n'

export const ViewModel = DefineMap.extend({
  order: Order,
  offers: Offer.List,

  // For accept-offer modal:
  offer: Offer,
  tx: '*',
  issuance: Issuance,
  portfolio: '*',
  isModalShown: 'boolean',

  expandOffer (offer) {
    this.offers.forEach(offer => {
      offer.isSelected = false
    })
    offer.isSelected = true
  },

  // Collect details and if everything is OK then open the modal.
  acceptOffer (offer) {
    const portfolio = Session.current.portfolios[0]
    console.log(`acceptOffer`, offer)
    typeforce('Offer', offer)
    typeforce('Portfolio', portfolio)

    return Promise.all([
      Session.current.issuancesPromise,
      portfolio.getNextAddress(),
      portfolio.getNextAddress(true)
    ]).then(([issuances, addrPair, changeAddrPair]) => {
      // todo: figure out a better way to find the issuance with preloaded UTXO.
      const issuance = this.order.type === 'SELL'
        ? issuances.filter(issuance => issuance._id === this.order.issuanceId)[0]
        : this.issuance

      // Change address (Empty EQB for transaction fee or BTC for change):
      const changeAddr = this.order.type === 'SELL' ? changeAddrPair.EQB : changeAddrPair.BTC

      // Refund address for Bid flow:
      if (this.order.type === 'BUY') {
        this.order.btcAddress = addrPair.BTC
      }

      // By default set htlc2 timelock to the half of htlc1 (user will be able to change it in the modal):
      offer.timelock2 = Math.floor(offer.timelock / 2)

      console.log(`acceptOffer: createHtlc2 offer, order, portfolio, issuance, changeAddr`, offer, this.order, portfolio, issuance, changeAddr)
      const txData = createHtlc2(offer, this.order, portfolio, issuance, changeAddr)
      const tx = new Transaction(txData)
      // todo: show UI modal with tx details (amount, fee, etc)
      this.openAcceptOfferModal(offer, tx, issuance, portfolio)
    }).catch(dispatchAlertError)
  },

  openAcceptOfferModal (offer, tx, issuance, portfolio) {
    typeforce(typeforce.tuple('Offer', 'Transaction', 'Issuance'), [offer, tx, issuance])
    this.offer = offer
    this.tx = tx
    this.issuance = issuance
    this.portfolio = portfolio
    this.isModalShown = false
    this.isModalShown = true
  },

  // HTLC 2: sending securities locked with secret hash.
  sendSecurities (args) {
    typeforce(typeforce.tuple('Number', '?String'), [args[1], args[2]])
    const timelock = args[1]
    const description = args[2]

    const order = this.order
    const offer = this.offer
    const tx = this.tx
    try {
      // will update tx with new hex, txId and timelock.
      tx.rebuild({timelock})

    } catch (err) {
      console.log(err)
      dispatchAlertError({
        message: `Cannot re-build transaction with the provided timelock ${timelock}`
      })
      return
    }
    typeforce('Offer', offer)
    typeforce('Transaction', tx)

    tx.description = description || tx.description
    return tx.save()
      .then(() => updateOrder(order, tx))
      .then(() => updateOffer(offer, tx))
      .then(() => dispatchAlert(hub, tx, route))
      .catch(dispatchAlertError)
  }
})

function updateOrder (order, tx) {
  // Address is defined during tx creation, now we save it (for refund and change):
  if (order.type === 'SELL') {
    order.eqbAddress = tx.fromAddress
  }
  return order.save()
}

function updateOffer (offer, tx) {
  // todo: we should NOT update the offer directly here since it belongs to a different user. API should do it when creates a receiver transaction.
  offer.htlcTxId2 = tx.txId
  offer.htlcStep = 2
  offer.isAccepted = true
  offer.timelock2 = tx.timelock
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
  tag: 'order-offers-data',
  ViewModel,
  view
})
