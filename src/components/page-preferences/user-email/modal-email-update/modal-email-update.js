/**
 * @module {can.Component} components/page-preferences/user-email/modal-email-update user-email > modal-email-update
 * @parent components.user-preferences
 *
 * Shows a modal to edit the user email.
 *
 * @signature `<modal-email-update />`
 *
 * @link ../src/components/page-preferences/user-email/modal-email-update/modal-email-update.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-email/modal-email-update/modal-email-update.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './modal-email-update.less'
import view from './modal-email-update.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'edit'
  },
  email: 'string',
  user: {},
  edit () {
    this.mode = 'edit'
  },
  code () {
    this.mode = 'code'
  },
  verify () {
    this.user.email = this.email
    this.user.verified = false
    this.close()
  },
  close: '*'
})

export default Component.extend({
  tag: 'modal-email-update',
  ViewModel,
  view
})
