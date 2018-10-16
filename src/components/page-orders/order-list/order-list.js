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
import route from 'can-route'
import canBatch from 'can-event/batch/'

const labelStatusMap = {
  OPEN: 'info',
  TRADING: 'progress',
  'TRADING-AVAILABLE': 'progress',
  CANCELLED: 'danger',
  CLOSED: 'success',
  EXPIRED: 'inactive'
}

export const ViewModel = DefineMap.extend({
  // ENUM ['ORDER', 'OFFER']
  type: {
    get (val) {
      return val === 'OFFER' ? val : 'ORDER'
    }
  },
  mode: 'string',
  // Either orders or offers:
  items: {
    type: '*',
    set (val) {
      const itemId = route.attr('itemId')
      if (itemId) {
        const item = val && val.filter(o => o._id === itemId)[0]
        if (item) {
          this.mode = item.type // resets selectedIndex, so...
          canBatch.after(() => this.selectItem(item)) // select it after everything resolves
        }
      }
      return val
    }
  },
  // dir = 1 or -1
  sort (list, sortby, dir) {
    return list.sort(function (a, b) {
      if (a[sortby] < b[sortby]) {
        return -1 * dir
      } else if (a[sortby] > b[sortby]) {
        return 1 * dir
      } else {
        return 0
      }
    })
  },
  itemsFiltered: {
    get () {
      const isArchive = this.mode === 'ARCHIVE'
      const items = this.items || []
      const filtered = items.filter(item => {
        const itemIsClosedOrCancelled = ['CLOSED', 'CANCELLED'].indexOf(item.status) !== -1
        const itemTypeMatchesMode = item.type === this.mode
        const itemNotClosedOrCancelledAndMatchesMode = !itemIsClosedOrCancelled && itemTypeMatchesMode
        return isArchive ? itemIsClosedOrCancelled : itemNotClosedOrCancelledAndMatchesMode
      })
      return this.sort(filtered, 'createdAt', -1)
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
    get (val) {
      if (!this.itemsFiltered || !this.itemsFiltered.length) {
        return null
      }
      if (!val) {
        val = this.itemsFiltered[0]
      }
      return val
    }
  }
})

export default Component.extend({
  tag: 'order-list',
  ViewModel,
  view
})

export { labelStatusMap }
