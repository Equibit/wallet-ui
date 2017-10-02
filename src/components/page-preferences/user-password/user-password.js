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

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.isModalShown = true
  }
})

export default Component.extend({
  tag: 'user-password',
  ViewModel,
  view
})
