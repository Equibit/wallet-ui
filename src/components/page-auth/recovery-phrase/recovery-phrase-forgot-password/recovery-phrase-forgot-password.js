/**
 * @module {can.Component} components/page-auth/recovery-phrase/recovery-phrase-forgot-password recovery-phrase-forgot-password
 * @parent components.auth
 *
 * Prompts the user to enter the backup recovery phrase as part of the forgot password flow.
 *
 * @signature `<recovery-phrase-forgot-password />`
 *
 * @link ../src/components/page-auth/recovery-phrase/recovery-phrase-forgot-password/recovery-phrase-forgot-password.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/recovery-phrase-forgot-password/recovery-phrase-forgot-password.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './recovery-phrase-forgot-password.less'
import view from './recovery-phrase-forgot-password.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'prompt'
  },
  prompt () {
    this.mode = 'prompt'
  },
  warning () {
    this.mode = 'warning'
  }
})

export default Component.extend({
  tag: 'recovery-phrase-forgot-password',
  ViewModel,
  view
})
