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

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './order-offers-accepted.less'
import view from './order-offers-accepted.stache'
import Offer from '../../../models/offer'

export const ViewModel = DefineMap.extend({
  offers: Offer.List,
  collectPayment (offer) {
    console.log(`collectPayment offer:`, offer)
  }
})

export default Component.extend({
  tag: 'order-offers-accepted',
  ViewModel,
  view
})
