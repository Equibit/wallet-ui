/**
 * @module {can.Component} components/page-offers/offer-details offer-details
 * @parent components.buy-sell-offers 4
 *
 * This component shows the details of an offer.
 *
 * @signature `<offer-details />`
 *
 * @link ../src/components/page-offers/offer-details/offer-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-details/offer-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './offer-details.less'
import view from './offer-details.stache'
import Offer from '~/models/offer'

export const ViewModel = DefineMap.extend({
  // ENUM ['SELL', 'BUY']
  type: 'string',
  offer: Offer,
  offersLength: 'number',
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.isModalShown = true
  }
})

export default Component.extend({
  tag: 'offer-details',
  ViewModel,
  view
})
