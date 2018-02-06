/**
 * @module {can.Component} components/trade-funds/send-popup send-popup
 * @parent components.portfolio 0
 *
 * A short description of the send-popup component
 *
 * @signature `<send-popup />`
 *
 * @link ../src/components/trade-funds/send-popup/send-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/send-popup/send-popup.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './send-popup.less'
import view from './send-popup.stache'
import Session from '~/models/session'
import FormData from './form-data'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  issuances: '*',
  formData: {
    get (val) {
      if (val) {
        return val
      }
      return new FormData({
        portfolio: this.portfolio,
        issuanceOnly: this.issuanceOnly,
        rates: Session.current.rates
      })
    }
  },
  mode: {
    value: 'edit'
  },
  issuanceOnly: 'boolean',
  toAddress: '*',
  next () {
    this.formData.validate()
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
    this.sendFn(this.formData)
      .then(() => {
        this.isSending = false
        close()
      })
      .catch(err => {
        this.isSending = false
        close()
        throw err
      })
  },

  openReceiveForm (close) {
    this.dispatch('receiveform')
    close()
  }
})

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
})
