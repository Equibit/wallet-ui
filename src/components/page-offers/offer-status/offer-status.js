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
import './offer-status.less'
import view from './offer-status.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-status component'
  }
})

export default Component.extend({
  tag: 'offer-status',
  ViewModel,
  view
})
