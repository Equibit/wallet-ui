/**
 * @module {can.Component} components/trade-funds/place-order place-order
 * @parent components.buy-sell 1
 *
 * This component shows the modal with the forms for placing a buy or sell order.
 *
 * @signature `<place-order />`
 *
 * @link ../src/components/trade-funds/place-order/place-order.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-order/place-order.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './place-order.less'
import view from './place-order.stache'
import Issuance from '../../../models/issuance'
import FormData from './form-data'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  issuance: '*',
  mode: {
    value: 'edit'
  },
  authIssuancesOnly: 'boolean',
  formData: {
    get (val) {
      if (val) {
        return val
      }
      return new FormData({
        portfolio: this.portfolio,
        authIssuancesOnly: this.authIssuancesOnly,
        rates: Session.current.rates
      })
    }
  },

  next () {
    this.formData.validate()
    if (!this.formData.isValid) {
      // return
    }
    this.mode = 'confirm'
  },
  edit () {
    this.mode = 'edit'
  },
  send (close) {
    this.dispatch('send', [this.formData])
    close()
  },
})

export default Component.extend({
  tag: 'place-order',
  ViewModel,
  view
})
