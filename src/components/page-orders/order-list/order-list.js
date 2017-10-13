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
  // ENUM ['ORDER', 'OFFER']
  type: {
    get (val) {
      return val === 'OFFER' ? val : 'ORDER'
    }
  },
  mode: {
    get (val) {
      return val || 'SELL'
    }
  },
  // Either orders or offers:
  items: '*',
  itemsFiltered: {
    get () {
      return this.items && this.items.filter(item => {
        return this.mode === 'ARCHIVE'
          ? ['CLOSED', 'CANCELLED'].indexOf(item.status) !== -1
          : ['CLOSED', 'CANCELLED'].indexOf(item.status) === -1 && item.type === this.mode
      })
    }
  },
  switchMode (mode) {
    this.mode = mode
  },
  toLabel (status) {
    return labelStatusMap[status] || labelStatusMap.OPEN
  },
  selectItem (item) {
    this.selectedItem = item
  },
  selectedItem: {
    set (item) {
      if (!this.items || !this.items.length) {
        return
      }
      if (!item) {
        item = this.items[0]
      }
      this.items.selectItem(item)
      return item
    }
  }
})

export default Component.extend({
  tag: 'order-list',
  ViewModel,
  view
})

export { labelStatusMap }
