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
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import { createHtlc2 } from '../../../models/transaction/transaction-create-htlc2'
import { translate } from '../../../i18n/i18n'

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
    typeforce('Offer', offer)

    const portfolio = Session.current.portfolios[0]

    return Promise.all([
      Session.current.issuancesPromise,
      portfolio.getNextAddress(true)
    ]).then(([issuances, changeAddrPair]) => {
      // todo: figure out a better way to find the issuance with preloaded UTXO.
      const issuance = issuances.filter(issuance => issuance._id === this.order.issuanceId)[0]

      console.log(`acceptOffer: createHtlc2 offer, order, portfolio, issuance, changeAddrPair`, offer, this.order, portfolio, issuance, changeAddrPair)
      const txData = createHtlc2(offer, this.order, portfolio, issuance, changeAddrPair)
      const tx = new Transaction(txData)
      return tx.save()
        .then(tx => updateOffer(offer, tx))
        .then(offer => dispatchAlert(hub, tx, route))
    }).catch(dispatchAlertError)
  }
})

function updateOffer (offer, tx) {
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

export default Component.extend({
  tag: 'order-offers-data',
  ViewModel,
  view
})
