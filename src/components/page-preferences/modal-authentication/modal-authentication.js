/**
 * @module {can.Component} components/page-preferences/modal-authentication modal-authentication
 * @parent components.user-preferences
 *
 * A short description of the modal-authentication component
 *
 * @signature `<modal-authentication />`
 *
 * @link ../src/components/page-preferences/modal-authentication/modal-authentication.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/modal-authentication/modal-authentication.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './modal-authentication.less'
import view from './modal-authentication.stache'

export const ViewModel = DefineMap.extend({
  secondFactorCode: 'string',
  verify (close) {
    this.dispatch('verified', [this.secondFactorCode])
    this.doClose(close)
  },
  doClose (close) {
    this.dispatch('close')
    close()
  }
})

export default Component.extend({
  tag: 'modal-authentication',
  ViewModel,
  view
})
