import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-orders.less'
import view from './page-orders.stache'
import Session from '../../models/session'
import Order from '../../models/order'

export const ViewModel = DefineMap.extend({
  ordersPromise: {
    value () {
      if (Session.current) {
        return Order.getList({userId: Session.current.user._id})
      }
    }
  },
  orders: {
    get (val, resolve) {
      if (val) {
        return val
      }
      if (this.ordersPromise) {
        this.ordersPromise.then(resolve)
      }
    }
  },
  selectedOrder: '*'
})

export default Component.extend({
  tag: 'page-orders',
  ViewModel,
  view
})
