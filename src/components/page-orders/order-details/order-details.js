/**
 * @module {can.Component} components/page-orders/order-details order-details
 * @parent components.buy-sell 5
 *
 * This component shows the details of an order.
 *
 * @signature `<order-details />`
 *
 * @link ../src/components/page-orders/order-details/order-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-details/order-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './order-details.less'
import view from './order-details.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'

export const ViewModel = DefineMap.extend({
  // ENUM ['SELL', 'BUY']
  type: 'string',
  order: Order,
  ordersLength: 'number',
  offersLoaded: 'boolean',
  offers: {
    get (val, resolve) {
      if (val) {
        return val
      }
      this.offersLoaded = false
      if (this.order) {
        Offer.getList({orderId: this.order._id}).then(offers => {
          if (offers && offers[0]) {
            offers[0].isSelected = true
          }
          resolve(offers)
          this.offersLoaded = true
        })
      }
    }
  },
  newOffers: {
    get () {
      return this.offers && this.offers.filter(o => !o.isAccepted)
    }
  },
  acceptedOffers: {
    get () {
      return this.offers && this.offers.filter(o => o.isAccepted)
    }
  },
  allowCancelOrder: {
    get () {
      const order = this.order
      const orderIsOpen = order && order.status === 'OPEN'
      const offersLoaded = this.offersLoaded
      const acceptedOffers = this.acceptedOffers
      const hasAcceptedAny = !!(acceptedOffers && acceptedOffers.length)
      if (!orderIsOpen || !offersLoaded || hasAcceptedAny) {
        return false
      }
      return true
    }
  },
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.isModalShown = true
  }
})

export default Component.extend({
  tag: 'order-details',
  ViewModel,
  view
})
