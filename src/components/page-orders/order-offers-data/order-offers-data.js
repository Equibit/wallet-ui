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
import hub, { dispatchAlertError }  from '../../../utils/event-hub'
import './order-offers-data.less'
import view from './order-offers-data.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Session from '../../../models/session'

export const ViewModel = DefineMap.extend({
  order: Order,
  offers: {
    get (val, resolve) {
      if (val) {
        return val
      }
      if (this.order) {
        Offer.getList({orderId: this.order._id}).then(offers => {
          if (offers && offers[0]) {
            offers[0].isSelected = true
          }
          resolve(offers)
        })
      }
    }
  },
  expandOffer (offer) {
    this.offers.forEach(offer => {
      offer.isSelected = false
    })
    offer.isSelected = true
  },
  acceptOffer (offer) {
    console.log(`acceptOffer`, offer)

    return Promise.all([
      offer.issuancePromise,
      offer.orderPromise
    ]).then(([issuance, order]) => {
      const tx = createHtlcTx2(offer, order, Session.current.portfolios[0], issuance)
      return tx.save()
        .then(tx => updateOffer(offer, tx))
        .then(offer => dispatchAlert(hub, tx, route))
    }).catch(dispatchAlertError)
  }
})

function updateOffer(offer, tx) {
  offer.htlcStep = 2
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

// todo: separate async actions from others (e.g. changeAddr using portfolio, issuance using offer)
// technically `offer` and `session` should be enough on page level.
/**
 * This is the 2nd HTLC transaction of 4.
 * Case: Sell issuance:
 * - amount is EQB quantity
 * - receiverA: eqbAddress
 * - from, receiverB, changeAddr: portfolio address or issuanceAddress
 */
function createHtlcTx2 (offer, order, portfolio, issuance) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance'), arguments)

  const amount = offer.quantity
  const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
  const toAddressA = order.type === 'SELL' ? offer.eqbAddress : order.btcAddress
  const toAddressB = order.type === 'SELL' ? issuance.issuanceAddress : offer.refundEqbAddress
  // todo: calculate transaction fee:
  const transactionFee = 1000
  // todo: figure out # of blocks VS absolute timestamp: (144 blocks/day).
  const timelock = offer.timelock
  const hashlock = offer.secretHash
  const htlcStep = 1

  const txouts = issuance.getTxoutsFor(amount)
    .map(a => merge(a, {keyPair: issuance.keys}))

  // todo: get utxo of empty EQB here.
  const txoutsFee = portfolio
    .getTxouts(transactionFee, currencyType)
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))
  txouts.push.apply(txouts, txoutsFee)

  const options = {
    fee: transactionFee,
    changeAddr: offer.type === 'BUY' ? changeAddrPair.BTC : changeAddrPair.EQB,
    type: offer.type,
    currencyType,
    description: (offer.type === 'BUY' ? 'Buying' : 'Selling') + ' securities (HTLC #1)',
    issuance: issuance,
    htlcStep
  }
  return Transaction.makeHtlc(amount, toAddressA, toAddressB, hashlock, timelock, txouts, options)
}

export default Component.extend({
  tag: 'order-offers-data',
  ViewModel,
  view
})
