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
import Order from '~/models/order'

export const ViewModel = DefineMap.extend({
  order: Order,
  closeModal: '*',
  confirm () {
    const order = this.order
    order.status = 'CANCELLED'
    order.save().then(() => {
      this.closeModal()
    })
  }
})

export default Component.extend({
  tag: 'cancel-order',
  ViewModel,
  view
})
