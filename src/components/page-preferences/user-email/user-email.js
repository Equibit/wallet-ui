/**
 * @module {can.Component} components/page-preferences/user-email user-email
 * @parent components.user-preferences
 *
 * A short description of the user-email component
 *
 * @signature `<user-email />`
 *
 * @link ../src/components/page-preferences/user-email/user-email.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-email/user-email.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './user-email.less'
import view from './user-email.stache'
import User from '~/models/user/'

export const ViewModel = DefineMap.extend({
  modal: 'string',
  showAuthenticationModal () {
    // Note: we need to re-insert the modal content:
    this.modal = null
    this.modal = 'authentication'
  },
  showEmailUpdateModal () {
    this.modal = null
    this.modal = 'email'
  },
  user: User
})

export default Component.extend({
  tag: 'user-email',
  ViewModel,
  view
})
