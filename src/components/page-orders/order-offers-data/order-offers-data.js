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

  orderIsCancelled: {
    get () {
      const order = this.order || {}
      const status = order.status || ''
      const isCancelled = status === 'CANCELLED'
      return isCancelled
    }
  },

  // something (bootstrap?) is deduping classnames so needed a helper.
  collapsed (offer) {
    var collapsed = ''
    if (this.orderIsCancelled) {
      collapsed = 'collapsed'
    }
    if (!offer || !offer.isSelected) {
      collapsed = 'collapsed'
    }
    return collapsed
  },

  expandOffer (offer) {
    this.offers.forEach(offer => {
      offer.isSelected = false
    })
    if (!this.orderIsCancelled) {
      offer.isSelected = true
    }
  },

  // can only accept one at a time, this is set after clicking 'accept' but before the modal opens
  acceptingOffer: '*',
  // Collect details and if everything is OK then open the modal.
  acceptOffer (offer) {
    const portfolio = Session.current.portfolios[0]
    console.log(`acceptOffer`, offer)
    typeforce('Offer', offer)
    typeforce('Portfolio', portfolio)
    this.acceptingOffer = offer

    // const isIssuer = this.order.type === 'SELL' && this.issuance.userId === Session.current.user._id
    // const issuancesPromise = isIssuer ? Session.current.issuancesPromise : Session.current.portfolios[0].securitiesPromise

    return Promise.all([
      // Session.current.issuancesPromise,
      portfolio.getNextAddress(),
      portfolio.getNextAddress(true),
      Session.current.transactionFeeRatesPromise
    ]).then(([addrPair, changeAddrPair, transactionFeeRates]) => {
      // todo: figure out a better way to find the issuance with preloaded UTXO.
      // const issuance = this.order.type === 'SELL'
      //   ? issuances.filter(issuance => issuance._id === this.order.issuanceId)[0]
      //   : this.issuance

      if (this.issuance && !this.issuance.utxo && this.order.type === 'SELL') {
        const message = 'No UTXO for this issuance. Cannot accept the offer.'
        console.error(message, this.issuance)
        throw new Error(message)
      }
      const issuance = this.issuance

      // Change address (Empty EQB for transaction fee or BTC for change):
      const changeAddr = this.order.type === 'SELL' ? changeAddrPair.EQB : changeAddrPair.BTC

      // todo: BTC should be different for every new offer of the same order.
      // todo: Use btcAddress as a map with offer id for property names (`this.order.btcAddresses[this.offer._id]`).
      // Refund address for Bid flow:
      if (this.order.type === 'BUY' && !this.order.btcAddress) {
        this.order.btcAddress = addrPair.BTC
      }

      // By default set htlc2 timelock to the half of htlc1 (user will be able to change it in the modal):
      offer.timelock2 = Math.floor(offer.timelock / 2)

      console.log(`acceptOffer: createHtlc2 offer, order, portfolio, issuance, changeAddr`, offer, this.order, portfolio, issuance, changeAddr)
      const txData = createHtlc2(offer, this.order, portfolio, issuance, changeAddr, transactionFeeRates.regular)
      const tx = new Transaction(txData)
      // todo: show UI modal with tx details (amount, fee, etc)
      this.openAcceptOfferModal(offer, tx, issuance, portfolio)
      this.acceptingOffer = undefined
    }).catch(err => {
      this.acceptingOffer = undefined
      dispatchAlertError(err)
    })
  },

  openAcceptOfferModal (offer, tx, issuance, portfolio) {
    typeforce(typeforce.tuple('Offer', 'Transaction', '?Issuance'), [offer, tx, issuance])
    if (offer.assetType === 'ISSUANCE') {
      typeforce('Issuance', issuance)
    }
    this.offer = offer
    this.tx = tx
    this.issuance = issuance
    this.portfolio = portfolio
    this.isModalShown = false
    this.isModalShown = true
  },

  // HTLC 2: sending securities locked with secret hash.
  sendSecurities (timelock, description) {
    typeforce(typeforce.tuple('Number', '?String'), arguments)

    const order = this.order
    const offer = this.offer
    const tx = this.tx

    if (offer.timelock2 !== timelock) {
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
