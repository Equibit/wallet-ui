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
import User from '~/models/user/'
import hub from '~/utils/event-hub'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'edit',
    set (val) {
      if (!val) {
        return 'edit'
      } else {
        return val
      }
    }
  },
  email: 'string',
  codeString: 'string',
  user: {},
  error: 'string',
  edit () {
    this.mode = 'edit'
  },
  code () {
    this.sendVerificationEmail(this.email).then(user => {
      this.mode = 'code'
    }, error => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'error',
        'title': error.message
      })
      this.error = error
    })
  },
  verify () {
    this.error = null
    User.connection.updateData({
      _id: this.user._id,
      emailVerificationCode: this.codeString
    }).then(user => {
      this.dispatch('verified', [this.codeString])
      this.close()
    }, error => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'error',
        'title': error.message
      })
      this.error = error
    })
  },
  close: '*',
  sendVerificationEmail: {
    type: '*',
    value: function () { return Promise.reject('not implemented') }
  }
})

export default Component.extend({
  tag: 'modal-email-update',
  ViewModel,
  view
})
