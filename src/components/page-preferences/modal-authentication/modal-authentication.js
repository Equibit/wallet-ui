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
import DefineMap from 'can-define/map/'
import './modal-authentication.less'
import view from './modal-authentication.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the modal-authentication component'
  }
})

export default Component.extend({
  tag: 'modal-authentication',
  ViewModel,
  view
})
