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
import User from '~/models/user/'
import hub from '~/utils/event-hub'
import { translate } from '~/i18n/'

export const ViewModel = DefineMap.extend({
  secondFactorCode: 'string',
  user: {},
  error: 'string',
  twoFactorPromise: {
    get (lastSetVal) {
      return User.connection.updateData({
        _id: this.user._id,
        requestTwoFactorCode: true
      })
    }
  },
  verify () {
    this.error = null
    User.connection.updateData({
      _id: this.user._id,
      twoFactorCode: this.secondFactorCode
    }).then(user => {
      this.dispatch('verified', [this.secondFactorCode])
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': translate('codeVerifiedMessage')
      })
      this.doClose()
    }, error => {
      this.error = error
    })
  },
  doClose () {
    this.dispatch('close')
    this.close()
    this.next()
  },
  // This happens after verify and should generally be overwritten with a next step
  next () {},
  close: '*' // from bootstrap-modal-content
})

export default Component.extend({
  tag: 'modal-authentication',
  ViewModel,
  view
})
