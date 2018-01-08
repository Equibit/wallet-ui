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
import Session from '~/models/session'
import sortedSetJSON from 'can-connect/helpers/sorted-set-json'

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
    get () {
      if (!this.issuanceAddress) {
        console.error('Orders require issuanceAddress!')
        return
      }
      const params = {
        $limit: this.limit,
        $skip: 0,
        type: this.type,
        status: 'OPEN',
        $sort: { 'price': this.type === 'BUY' ? -1 : 1 },
        issuanceAddress: this.issuanceAddress
      }
      return Order.getList(params)
    }
  },
  session: {
    value: function () {
      return Session.current
    }
  },
  rows: {
    get (val, resolve) {
      this.rowsPromise && this.rowsPromise.then(d => {
        resolve(d)
      })
    }
  },
  get totalQuantity () {
    return this.rows ? this.rows.reduce((sum, row) => (sum + row.quantity), 0) : 0
  },

  /**
   * Market depth chart as a background for order table tows.
   * @returns {Array<Number>}
   */
  get marketWidth () {
    // Accumulative quantity value per row:
    const hasLeftOffset = this.type === 'SELL'
    let quantityTab = 0
    if (!this.rows) {
      return []
    }
    return this.rows.map(row => {
      quantityTab += row.quantity
      const percentageWidth = Math.floor(quantityTab / this.totalQuantity * 100)
      const percentageOffset = hasLeftOffset ? 100 - percentageWidth : percentageWidth
      // console.log(`marketWidth: totalQuantity=${this.totalQuantity}, quantity=${quantity}, accumulativeQuantity=${this.accumulativeQuantity} => ${percentageOffset}`)
      return percentageOffset >= 100 ? 99 : (percentageOffset === 0 ? 1 : percentageOffset)
    })
  },

  buySell (type, order) {
    this.dispatch('buysell', [type, order])
  },

  ordersCallback: '*',
  ordersRemovedCallback: '*'
})

export default Component.extend({
  tag: 'orders-grid',
  ViewModel,
  view,
  events: {
    inserted () {
      Order.subscribe(this.viewModel.ordersCallback = order => {
        const rows = this.viewModel.rows
        const pageEndPrice = rows[rows.length - 1].price * (this.viewModel.type === 'BUY' ? -1 : 1)
        const orderPrice = order.price * (this.viewModel.type === 'BUY' ? -1 : 1)
        if (rows &&
          order.type === this.viewModel.type &&
          (rows.length < this.viewModel.limit || orderPrice < pageEndPrice)
        ) {
          // clear cached set and refresh, because the newly created item belongs in the shown page
          delete Order.connection.cacheConnection.getSetData()[sortedSetJSON(this.viewModel.rows.__listSet)]
          this.viewModel.trigger('limit')
        }
      })
      Order.subscribeUpdated(this.viewModel.ordersRemovedCallback = order => {
        const rows = this.viewModel.rows
        if (rows && (rows.indexOf(order) > -1 || rows.length === this.viewModel.limit - 1)) {
          // clear cached set and refresh, because we went from a full page to less than a full page
          delete Order.connection.cacheConnection.getSetData()[sortedSetJSON(this.viewModel.rows.__listSet)]
          this.viewModel.trigger('limit')
        }
      })
    },
    ' removed' () {
      Order.unSubscribe(this.viewModel.ordersCallback)
      Order.unSubscribeUpdated(this.viewModel.ordersRemovedCallback)
    }
  }
})
