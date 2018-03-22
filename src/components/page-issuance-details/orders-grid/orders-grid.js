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
import Offer from '~/models/offer'
import Session from '~/models/session'

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
  get userOffersPromise () {
    return Offer.getList({userId: Session.current.user._id})
  },
  userOffers: {
    get (setVal, resolve) {
      this.userOffersPromise.then(d => {
        resolve && resolve(d)
      })
      return []
    }
  },
  get userOfferOrderIds () {
    return this.userOffers.map(offer => offer.orderId)
  },
  session: {
    value: function () {
      return Session.current
    }
  },
  rows: {
    get (val, resolve) {
      this.rowsPromise && this.rowsPromise.then(d => {
        resolve && resolve(d)
      })
      return val
    }
  },
  get totalQuantity () {
    return this.rows ? this.rows.reduce((sum, row) => (sum + row.quantity), 0) : 0
  },
  // Return a reason why the user can't buy or sell against this order
  // Possible reasons include:
  //  - User is not logged in
  //  - User was the one who posted the order (can't buy from / sell to yourself)
  //  - User already made an offer against the FillOrKill order
  //  - User has no shares to sell, for a buy order (not yet implemented)
  // Note: for a partial order user can place multiple offers.
  whyUserCantOffer (row) {
    if (!this.session) {
      return 'Not logged in'
    }
    if (row.userId === this.session.user._id) {
      return 'User is owner'
    }
    if (~this.userOfferOrderIds.indexOf(row._id) && row.isFillOrKill) {
      return 'Offer exists'
    }
    if (!this.session.hasIssuanceUtxo(this.issuanceAddress)) {
      return 'No securities'
    }
    // TODO create a condition that shows that the number of shares
    // a user holds for an issuance is zero.
    // if () {
    //   return 'No shares to sell'
    // }
    return null
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

  buySell (order) {
    this.dispatch('buysell', [order])
  },

  userOfferForOrder (row) {
    return this.userOffers.filter(offer => offer.orderId === row._id)[0]
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
        const pageEndPrice = rows.length < 1 ? 0 : rows[rows.length - 1].price * (this.viewModel.type === 'BUY' ? -1 : 1)
        const orderPrice = order.price * (this.viewModel.type === 'BUY' ? -1 : 1)
        if (rows &&
          order.type === this.viewModel.type &&
          (rows.length < this.viewModel.limit || orderPrice < pageEndPrice)
        ) {
          this.viewModel.trigger('limit')
        }
      })
      Order.subscribeUpdated(this.viewModel.ordersRemovedCallback = order => {
        const rows = this.viewModel.rows
        if (rows && (rows.indexOf(order) > -1 || rows.length === this.viewModel.limit - 1)) {
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
