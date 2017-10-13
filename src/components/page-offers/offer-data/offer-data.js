/**
 * @module {can.Component} components/page-offers/offer-data offer-details > offer-data
 * @parent components.buy-sell-offers 5
 *
 * A short description of the offer-data component
 *
 * @signature `<offer-data />`
 *
 * @link ../src/components/page-offers/offer-data/offer-data.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-data/offer-data.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './offer-data.less'
import view from './offer-data.stache'
import Offer from '../../../models/offer'

export const ViewModel = DefineMap.extend({
  offer: Offer
})

export default Component.extend({
  tag: 'offer-data',
  ViewModel,
  view
})
