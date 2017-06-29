/**
 * @module {can.Component} components/page-preferences page-preferences
 * @parent components.pages
 *
 * A short description of the page-preferences component
 *
 * @signature `<page-preferences />`
 *
 * @link ../src/components/page-preferences/page-preferences.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/page-preferences.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-preferences.less'
import view from './page-preferences.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-preferences component'
  }
})

export default Component.extend({
  tag: 'page-preferences',
  ViewModel,
  view
})
