/**
 * @module {can.Component} components/trade-funds/send-popup/send-confirm-form send-popup > send-confirm-form
 * @parent components.portfolio 2
 *
 * A short description of the send-confirm-form component
 *
 * @signature `<send-confirm-form />`
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './send-confirm-form.less'
import view from './send-confirm-form.stache'

export const ViewModel = DefineMap.extend({
  formData: {
    type: '*'
  }
})

export default Component.extend({
  tag: 'send-confirm-form',
  ViewModel,
  view
})
