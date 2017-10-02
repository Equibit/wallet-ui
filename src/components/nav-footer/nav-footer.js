/**
 * @module {can.Component} components/nav-footer nav-footer
 * @parent components.common
 *
 * A short description of the nav-footer component
 *
 * @signature `<nav-footer />`
 *
 * @link ../src/components/nav-footer/nav-footer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/nav-footer/nav-footer.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './nav-footer.less'
import view from './nav-footer.stache'

export const ViewModel = DefineMap.extend({
  termsVisible: 'boolean',
  policyVisible: 'boolean',
  showTerms (popupFlag) {
    this[popupFlag] = false
    this[popupFlag] = true
  }
})

export default Component.extend({
  tag: 'nav-footer',
  ViewModel,
  view
})
