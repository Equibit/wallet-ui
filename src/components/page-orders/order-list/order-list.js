/**
 * @module {can.Component} components/page-orders/order-list order-list
 * @parent components.buy-sell 4
 *
 * This components shows a list of orders.
 *
 * @signature `<order-list />`
 *
 * @link ../src/components/page-orders/order-list/order-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-list/order-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './order-list.less'
import view from './order-list.stache'

const labelStatusMap = {
  OPEN: 'info',
  TRADING: 'progress',
  CANCELLED: 'danger',
  CLOSED: 'info'
}

export const ViewModel = DefineMap.extend({
  orders: '*',
  toLabel (status) {
    return labelStatusMap[status] || labelStatusMap.OPEN
  },
  selectOrder (order) {
    this.selectedOrder = order
  },
  selectedOrder: {
    set (order) {
      if (!this.orders || !this.orders.length) {
        return
      }
      if (!order) {
        order = this.orders[0]
      }
      this.orders.forEach(order => {
        order.isSelected = false
      })
      order.isSelected = true
      return order
    }
  }
})

export default Component.extend({
  tag: 'order-list',
  ViewModel,
  view
})
