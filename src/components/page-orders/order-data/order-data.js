/**
 * @module {can.Component} components/page-orders/order-data order-details > order-data
 * @parent components.buy-sell 6
 *
 * A short description of the order-data component
 *
 * @signature `<order-data />`
 *
 * @link ../src/components/page-orders/order-data/order-data.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-data/order-data.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './order-data.less'
import view from './order-data.stache'

export const ViewModel = DefineMap.extend({
  order: '*',
  offers: '*',
  get filledQuantity () {
    return this.order && this.offers && this.offers.reduce((sum, offer) => {
      return sum + offer.quantity
    }, 0)
  }
})

export default Component.extend({
  tag: 'order-data',
  ViewModel,
  view
})
