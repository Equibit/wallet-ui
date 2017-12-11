/**
 * @module {can.Component} components/page-preferences/user-password user-password
 * @parent components.user-preferences
 *
 * A short description of the user-password component
 *
 * @signature `<user-password />`
 *
 * @link ../src/components/page-preferences/user-password/user-password.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-password/user-password.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './user-password.less'
import view from './user-password.stache'
import Session from '~/models/session'

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  passwordCurrent: 'string',
  passwordNew: 'string',
  errorMessage: 'string',
  visibleStates: {
    value: {
      passwordCurrent: false,
      passwordNew: false
    }
  },
  toggleVisible (key) {
    this.visibleStates[key] = !this.visibleStates[key]
  },
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.isModalShown = true
  },
  save () {
    Session.current.user.changePassword(this.passwordNew, this.passwordCurrent).then(
      () => {
        this.passwordCurrent = ''
        this.passwordNew = ''
        this.errorMessage = ''
        this.close()
      },
      error => {
        this.errorMessage = error.message
      }
    )
  },
  close: '*'
})

export default Component.extend({
  tag: 'user-password',
  ViewModel,
  view
})
