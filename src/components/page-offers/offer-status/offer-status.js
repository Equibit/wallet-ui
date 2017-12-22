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
import './offer-status.less'
import view from './offer-status.stache'
import Offer from '../../../models/offer'

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
  offer: Offer,
  status: {
    set: enumSetter(['OPEN', 'TRADING', 'CLOSED', 'CANCELLED', 'REJECTED'])
  },
  date: '*',
  get dateDisplay () {
    return moment(this.date).format('MM/DD @h:mm A')   // 04/29 @2:30 pm
  },
  collectSecurities () {
    console.log(`collectSecurities`, this.offer)
    typeforce('Offer', this.offer)

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
        .then(tx => updateOrder(this.order, offer, tx))
        .then(() => dispatchAlert(hub, tx, route))
    }).catch(dispatchAlertError)
  }
})

export default Component.extend({
  tag: 'offer-status',
  ViewModel,
  view
})
