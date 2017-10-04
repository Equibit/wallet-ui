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
import './sell-orders.less'
import view from './sell-orders.stache'
import Order from '~/models/order'

let accumulativeQuantity = 0

// TODO: turn FIXTURES OFF
import '~/models/fixtures/sell-order'

export const ViewModel = DefineMap.extend({
  address: 'string',
  limit: 'number',
  rowsPromise: {
    get () {
      if (!this.address){
        console.error('Orders require issuance address!')
        return
      }
      // let params = this.limit ? {
      //   $limit: this.limit,
      //   $skip: 0
      // } : {}
      const params = {
        type: 'SELL',
        address: this.address
      }
      return Order.getList(params)
    }
  },
  rows: {
    get (lastVal, resolve) {
      accumulativeQuantity = 0
      this.rowsPromise.then(resolve)
    }
  },
  get totalQuantity () {
    return this.rows.reduce((sum, row) => (sum + row.quantity), 0)
  },
  marketWidth (quantity) {
    accumulativeQuantity += quantity
    let percentageOffset = 100 - Math.floor(accumulativeQuantity / this.totalQuantity * 100)
    console.log(`marketWidth: totalQuantity=${this.totalQuantity}, quantity=${quantity}, accumulativeQuantity=${accumulativeQuantity} => ${percentageOffset}`)
    return percentageOffset >= 100 ? 99 : percentageOffset
  }
})

export default Component.extend({
  tag: 'sell-orders',
  ViewModel,
  view
})
