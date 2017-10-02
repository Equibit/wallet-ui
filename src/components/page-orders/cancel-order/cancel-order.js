/**
 * @module {can.Component} components/page-orders/cancel-order cancel-order
 * @parent components.buy-sell 10
 *
 * Modal shown when wanting to cancel an order.
 *
 * @signature `<cancel-order />`
 *
 * @link ../src/components/page-orders/cancel-order/cancel-order.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/cancel-order/cancel-order.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './cancel-order.less'
import view from './cancel-order.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the cancel-order component'
  }
})

export default Component.extend({
  tag: 'cancel-order',
  ViewModel,
  view
})
