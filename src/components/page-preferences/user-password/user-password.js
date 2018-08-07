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
import isEmptyObject from 'can-util/js/is-empty-object/'
import './user-password.less'
import view from './user-password.stache'
import Session from '~/models/session'
import hub from '~/utils/event-hub'
import i18n from '~/i18n/'
import zxcvbn from 'zxcvbn'

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  passwordCurrent: 'string',
  passwordNew: 'string',
  errors: {
    value: {}
  },
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
  clearErrors (field) {
    this.errors[field] = null
  },
  save () {
    if (zxcvbn(this.passwordNew).score !== 4) {
      if (this.passwordNew.length === 0) {
        this.errors.set('password', 'Password is missing')
      } else {
        this.errors.set('password', 'Password too weak')
      }
      return
    }

    Session.current.user.changePassword(this.passwordNew, this.passwordCurrent).then(
      () => {
        this.passwordCurrent = ''
        this.passwordNew = ''
        this.errors = {}
        hub.dispatch({
          'type': 'alert',
          'kind': 'success',
          'title': i18n.changesSaved,
          'displayInterval': 10000
        })
        this.close()
      },
      error => {
        if (isEmptyObject(error.errors)) {
          this.errors.set('general', error.message)
        } else {
          this.errors.assign(error.errors)
        }
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
