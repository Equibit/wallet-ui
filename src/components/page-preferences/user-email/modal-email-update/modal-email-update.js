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
import { translate } from '~/i18n/'

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
    this.sendVerificationEmail(this.email).then(() => {
      if (this.user.emailVerified) {
        // email is already verified?
        // This means the user probably didn't change email addresses
        // and the API didn't unverify as a result.
        this.close()
      } else {
        this.mode = 'code'
      }
    }, error => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'danger',
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
    }).then(() => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': translate('changesSaved')
      })
      this.dispatch('verified', [this.codeString])
      this.close()
    }, error => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'danger',
        'title': error.message
      })
      this.error = error
    })
  },
  close: '*',
  sendVerificationEmail: {
    type: '*',
    value: function () { return Promise.reject(new Error('not implemented')) }
  }
})

export default Component.extend({
  tag: 'modal-email-update',
  ViewModel,
  view
})
