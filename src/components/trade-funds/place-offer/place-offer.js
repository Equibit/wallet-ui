/**
 * @module {can.Component} components/trade-funds/place-offer place-offer
 * @parent components.buy-sell-offers 0
 *
 * This component shows the modal with the forms for placing a buy or sell offers.
 *
 * @signature `<place-offer />`
 *
 * @link ../src/components/trade-funds/place-offer/place-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-offer/place-offer.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './place-offer.less'
import view from './place-offer.stache'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'
import FormData from './form-data'

export const ViewModel = DefineMap.extend({
  portfolio: Portfolio,
  order: Order,
  type: {
    get (val) {
      return val === 'BUY' ? val : 'SELL'
    }
  },
  mode: {
    value: 'edit'
  },
  formData: {
    get (val) {
      if (val) {
        return val
      }
      if (!this.portfolio) {
        console.error('Requires a portfolio')
        return
      }
      if (!this.order) {
        console.error('Requires an order')
        return
      }
      return new FormData({
        portfolio: this.portfolio,
        order: this.order
      })
    }
  },

  next () {
    if (!this.formData.isValid) {
      return
    }
    this.mode = 'confirm'
  },
  edit () {
    this.mode = 'edit'
  },
  send (close) {
    this.dispatch('send', [this.formData, this.type])
    close()
  }
})

export default Component.extend({
  tag: 'place-offer',
  ViewModel,
  view
})
