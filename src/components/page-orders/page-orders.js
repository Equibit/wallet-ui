import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-orders.less'
import view from './page-orders.stache'
import Session from '../../models/session'
import Order from '../../models/order'

export const ViewModel = DefineMap.extend({
  ordersPromise: {
    get (val) {
      if (val && val.then) {
        return val
      }
      if (Session.current) {
        return Order.getList({userId: Session.current.user._id, $limit: 1000, $skip: 0})
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
  selectedItem: {
    get (val) {
      if (val) {
        return val
      }
      const order = this.orders && this.orders.length && this.orders[0]
      if (order) {
        this.orders.selectItem(order)
      }
      // Returning undefined when falsey to avoid a typecasting issue in a child component
      return order || undefined
    }
  },
  portfolio: '*'
})

export default Component.extend({
  tag: 'page-orders',
  ViewModel,
  view
})
