/**
 * @module {can.Component} components/page-auth/log-in log-in
 * @parent components.auth
 *
 * Login component
 *
 * @signature `<log-in {(session)}="session" {(email)}="email" />`
 *
 *  @param {models/session} session Application's {models/session} instance
 *  @param {String} User's email to pre-populate email input field
 *
 * @link ../src/components/page-auth/log-in/log-in.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/log-in/log-in.html
 *
**/

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './log-in.less'
import view from './log-in.stache'
import Session from '~/models/session'
import validate from '~/utils/validators'
import route from 'can-route'
import { setupLogoutTimer } from '~/utils/logout-timer'

export const ViewModel = DefineMap.extend({
  email: {
    type: 'string',
    set (value) {
      this.emailError = validate.email(value, {allowEmpty: 1})
      return value
    }
  },
  password: {
    type: 'string',
    set (value) {
      this.passwordError = validate.password(value, {allowEmpty: 1})
      return value
    }
  },
  session: {
    type: 'any'
  },
  /**
   * Toggles the password input visibility (password vs text type).
   */
  passwordVisible: {
    value: false
  },
  hashedPassword: 'string',
  isAccountCreated: {
    value: false
  },

  // Error validation:
  loginError: 'boolean',
  emailError: 'string',
  passwordError: 'string',
  get hasErrors () {
    this.emailError = validate.email(this.email, {allowEmpty: 0})
    this.passwordError = validate.password(this.password, {allowEmpty: 0})
    return this.emailError || this.passwordError
  },

  // Methods:
  logout: '*', // passed from parent component
  handleLogin (event, email, password) {
    this.loginError = false
    event.preventDefault()
    if (this.hasErrors) {
      return false
    }
    let user = { email, password }

    new Session({ user }).save()
      .then(() => {
        this.session = Session.current
        const user = this.session.user
        user.updatePasswordCache(password)
        if (!this.session.usingTempPassword) {
          user.loadWalletKeys()
        }
        setupLogoutTimer(user.autoLogoutTime, this.logout)
        route.data.page = this.session.usingTempPassword
          ? (user.isNewUser ? 'change-password' : 'recovery-phrase')
          : 'portfolio'
      })
      .catch(error => {
        console.log(error)
        this.loginError = true
      })
  },
  togglePassword () {
    this.passwordVisible = !this.passwordVisible
  }
})

export default Component.extend({
  tag: 'log-in',
  ViewModel,
  view
})
