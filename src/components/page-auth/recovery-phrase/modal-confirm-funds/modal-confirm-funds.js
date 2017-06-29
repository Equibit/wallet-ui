/**
 * @module {can.Component} components/page-auth/recovery-phrase/modal-confirm-funds modal-confirm-funds
 * @parent components.auth
 *
 * Shows a promtp to the user to confirm his balance is equal to 0.
 *
 * @signature `<modal-confirm-funds />`
 *
 * @link ../src/components/page-auth/recovery-phrase/modal-confirm-funds/modal-confirm-funds.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/modal-confirm-funds/modal-confirm-funds.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './modal-confirm-funds.less'
import view from './modal-confirm-funds.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'confirm'
  },
  confirm () {
    this.mode = 'confirm'
  },
  prompt () {
    this.mode = 'prompt'
  }
})

export default Component.extend({
  tag: 'modal-confirm-funds',
  ViewModel,
  view
})
