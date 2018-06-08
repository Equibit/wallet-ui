/**
 * @module {can.Component} components/page-preferences/user-autologout user-autologout
 * @parent components.user-preferences
 *
 * A short description of the user-autologout component
 *
 * @signature `<user-autologout />`
 *
 * @link ../src/components/page-preferences/user-autologout/user-autologout.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-autologout/user-autologout.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './user-autologout.less'
import view from './user-autologout.stache'
import feathersClient from '~/models/feathers-client'
import hub from '~/utils/event-hub'
import { translate } from '~/i18n/'

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  error: 'string',
  autoLogoutMinutes: {
    type: 'string',
    value () {
      return this.msToMinutes(this.user.autoLogoutTime).toString()
    }
  },
  msToMinutes (ms) {
    return (ms / 1000 / 60)
  },
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.autoLogoutMinutes = this.msToMinutes(this.user.autoLogoutTime).toString()
    this.error = null
    this.isModalShown = true
  },
  validateAndSave (close) {
    if (this.autoLogoutMinutes === '' || this.autoLogoutMinutes == null) {
      this.error = translate('autoLogoutTimeMissingMessage')
    } else if (+this.autoLogoutMinutes > 30) {
      this.error = translate('autoLogoutTimeTooLongMessage')
    } else if (+this.autoLogoutMinutes < 1) {
      this.error = translate('autoLogoutTimeTooShortMessage')
    } else {
      this.error = null
      feathersClient.service('/users').patch(
        this.user._id,
        { autoLogoutTime: this.autoLogoutMinutes * 60 * 1000 }
      )
      .then(user => {
        this.user.set(user)
        hub.dispatch({
          'type': 'alert',
          'kind': 'success',
          'title': translate('changesSaved'),
          'displayInterval': 10000
        })
        close && close()
      })
      .catch(e => { this.error = e.message })
    }
  }
})

export default Component.extend({
  tag: 'user-autologout',
  ViewModel,
  view
})
