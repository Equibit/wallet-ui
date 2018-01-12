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
import { buildTransaction } from '../../../models/transaction/transaction-build.js'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
import { translate } from '../../../i18n/i18n'

export const ViewModel = DefineMap.extend({
  order: Order,
  issuance: Issuance,
  offers: Offer.List,

  offer: {
    get () {
      const offer = this.offers[0]
      offer.htlcStep = 2
      return offer
    }
  },

  // HTLC 4:
  collectPayment (offer) {
    // todo: its a BTC transacaction for a SELL order. Generalize to check `order.type`.
    console.log(`collectPayment offer:`, offer)
    const order = this.order
    const issuance = this.issuance
    const user = Session.current.user
    const portfolio = Session.current.portfolios[0]

    typeforce('Offer', offer)
    typeforce('Order', order)
    typeforce('Issuance', issuance)
    typeforce('User', user)
    typeforce('Portfolio', portfolio)

    const inputs = [{
      txid: offer.htlcTxId1,
      vout: 0,
      // todo: we can have a problem here with giving one BTC address to all offers.
      keyPair: portfolio.findAddress(order.btcAddress).keyPair,
      htlc: {
        secret: offer.secret,
        // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
        refundAddr: offer.btcAddress,
        timelock: offer.timelock
      },
      sequence: '4294967295'
    }]
    const outputs = [{
      value: offer.quantity * order.price,
      address: order.btcAddress
    }]

    const txInfo = buildTransaction(inputs, outputs)

    const txConfig = {
      address: order.btcAddress,
      addressTxid: inputs[0].txid,
      addressVout: inputs[0].vout,
      type: 'SELL',
      currencyType: 'BTC',
      amount: offer.quantity * order.price,
      description: 'Collecting payment from HTLC',
      hex: txInfo.hex,
      txId: txInfo.txId,
      fromAddress: offer.btcAddress,
      toAddress: order.btcAddress,

      // Issuance details:
      companyName: offer.companyName,
      // companySlug: issuance.companySlug,
      issuanceId: offer.issuanceId,
      issuanceName: offer.issuanceName,
      issuanceType: offer.issuanceType
      // issuanceUnit: issuance.issuanceUnit
    }
    console.log(`collectPayment txConfig:`, txConfig)

    const tx = new Transaction(txConfig)

    return tx.save()
      .then(tx => updateOffer(offer, tx))
      .then(() => dispatchAlert(hub, tx, route))
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
