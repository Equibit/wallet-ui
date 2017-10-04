/**
 * @module {can.Component} components/sell-orders sell-orders
 * @parent components.issuance-details
 *
 * Issuance Details / Order Book / Sell Orders
 *
 * @signature `<sell-orders />`
 *
 * @link ../src/components/page-issuance-details/sell-orders/sell-orders.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/sell-orders/sell-orders.html
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './orders-grid.less'
import view from './orders-grid.stache'
import Order from '~/models/order'

// Note: for some reason if `this.accumulativeQuantity` is defined within DefineMap then `marketWidth` makes an infinite loop.
export const ViewModel = DefineMap.extend({ seal: false }, {
  type: {
    set (val) {
      if (['BUY', 'SELL'].indexOf(val) === -1) {
        console.error(`[sell-orders] Unexpected type ${val}`)
      }
      return val || 'SELL'
    }
  },
  address: 'string',
  limit: {
    type: 'number',
    value: 10
  },
  rowsPromise: {
    get () {
      if (!this.address){
        console.error('Orders require issuance address!')
        return
      }
      const params = {
        $limit: this.limit,
        $skip: 0,
        type: this.type,
        address: this.address
      }
      return Order.getList(params)
    }
  },
  rows: {
    get (lastVal, resolve) {
      this.accumulativeQuantity = 0
      this.rowsPromise.then(resolve)
    }
  },
  get totalQuantity () {
    return this.rows.reduce((sum, row) => (sum + row.quantity), 0)
  },
  marketWidth (quantity, isLeft) {
    this.accumulativeQuantity += quantity
    const percentageWidth = Math.floor(this.accumulativeQuantity / this.totalQuantity * 100)
    const percentageOffset = isLeft === 'offsetLeft' ? 100 - percentageWidth : percentageWidth
    // console.log(`marketWidth: totalQuantity=${this.totalQuantity}, quantity=${quantity}, accumulativeQuantity=${this.accumulativeQuantity} => ${percentageOffset}`)
    return percentageOffset >= 100 ? 99 : (percentageOffset === 0 ? 1 : percentageOffset)
  }
})

export default Component.extend({
  tag: 'orders-grid',
  ViewModel,
  view
})
