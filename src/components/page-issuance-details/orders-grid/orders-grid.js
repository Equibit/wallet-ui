/**
 * @module {can.Component} components/orders-grid orders-grid
 * @parent components.issuance-details
 *
 * Issuance Details / Order Book / Sell and Buy Orders
 *
 * @signature `<orders-grid type="BUY" limit="10" issuanceAddress:from="issuance.issuanceAddress" />`
 *
 * @link ../src/components/page-issuance-details/orders-grid/orders-grid.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/orders-grid/orders-grid.html
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
  issuanceAddress: 'string',
  limit: {
    type: 'number',
    value: 10
  },
  rowsPromise: {
    get (val) {
      if (!this.issuanceAddress) {
        console.error('Orders require issuanceAddress!')
        return
      }
      const params = {
        $limit: this.limit,
        $skip: 0,
        type: this.type,
        issuanceAddress: this.issuanceAddress
      }
      return Order.getList(params)
    }
  },
  rows: {
    get (lastVal, resolve) {
      this.accumulativeQuantity = 0
      this.rowsPromise && this.rowsPromise.then(resolve)
    }
  },
  get totalQuantity () {
    return this.rows.reduce((sum, row) => (sum + row.quantity), 0)
  },

  /**
   * Market depth chart as a background for order table tows.
   * @param quantity
   * @param hasLeftOffset Whether to show bar chart from the right (with left offset).
   * @returns {number}
   */
  marketWidth (quantity, hasLeftOffset) {
    // Accumulative quantity value per row:
    this.accumulativeQuantity += quantity
    const percentageWidth = Math.floor(this.accumulativeQuantity / this.totalQuantity * 100)
    const percentageOffset = hasLeftOffset === 'offsetLeft' ? 100 - percentageWidth : percentageWidth
    // console.log(`marketWidth: totalQuantity=${this.totalQuantity}, quantity=${quantity}, accumulativeQuantity=${this.accumulativeQuantity} => ${percentageOffset}`)
    return percentageOffset >= 100 ? 99 : (percentageOffset === 0 ? 1 : percentageOffset)
  }
})

export default Component.extend({
  tag: 'orders-grid',
  ViewModel,
  view
})
