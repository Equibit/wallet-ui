/**
 * @module {can.Component} components/page-orders/order-details order-details
 * @parent components.buy-sell 5
 *
 * This component shows the details of an order.
 *
 * @signature `<order-details />`
 *
 * @link ../src/components/page-orders/order-details/order-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-details/order-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './order-details.less'
import view from './order-details.stache'

export const ViewModel = DefineMap.extend({
  // ENUM ['ORDER', 'OFFER']
  type: {
    get (val) {
      return val === 'OFFER' ? val : 'ORDER'
    }
  },
  item: '*',
})

export default Component.extend({
  tag: 'order-details',
  ViewModel,
  view
})
