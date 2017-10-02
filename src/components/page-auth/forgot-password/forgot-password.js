/**
 * @module {can.Component} components/page-auth/forgot-password forgot-password
 * @parent components.auth
 *
 * Forgot Password
 *
 * @signature `<forgot-password {(email)}="email" />`
 *
 * On forgot-password request the server will send email with a temporary password. User will have to create a new
 * password once he logs in with the temporary one.
 *
 *  @param {String} User's email
 *
 * @link ../src/components/page-auth/forgot-password/forgot-password.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/forgot-password/forgot-password.html
 *
**/

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './forgot-password.less'
import view from './forgot-password.stache'
import User from '~/models/user/user'
import validate from '~/utils/validators'

export const ViewModel = DefineMap.extend({
  email: {
    type: 'string',
    set (value) {
      this.emailError = validate.email(value, {allowEmpty: 1})
      return value
    }
  },
  isDone: 'boolean',
  emailError: 'string',
  get isEmailValid () {
    this.emailError = validate.email(this.email, {allowEmpty: 0})
    return !this.emailError
  },

  // Methods:
  handleSubmit (event, email) {
    event.preventDefault()
    if (!this.isEmailValid) {
      return false
    }
    User.forgotPassword(email)
      .then(() => {
        this.isDone = true
      })
  }
})

export default Component.extend({
  tag: 'forgot-password',
  ViewModel,
  view
})
