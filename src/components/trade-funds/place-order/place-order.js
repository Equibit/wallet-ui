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
import Session from '../../../models/session'
import './place-order.less'
import view from './place-order.stache'
import FormData from './form-data'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  issuance: '*',
  type: {
    get (val) {
      return val === 'BUY' ? val : 'SELL'
    }
  },
  mode: {
    value: 'edit'
  },
  authIssuancesOnly: 'boolean',
  formData: {
    value (val) {
      if (val) {
        return val
      }
      return new FormData({
        portfolio: this.portfolio,
        issuance: this.issuance,
        session: Session.current,
        authIssuancesOnly: this.authIssuancesOnly,
        type: this.type
        // rates: Session.current.rates
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
  sendFn: '*',
  isSending: {
    value: false
  },
  send (close) {
    this.isSending = true
    this.sendFn(this.formData, this.formData.type)
      .then(() => {
        this.isSending = false
        close()
      })
      .catch(err => {
        this.isSending = false
        close()
        throw err
      })
  }
})

export default Component.extend({
  tag: 'place-order',
  ViewModel,
  view
})
