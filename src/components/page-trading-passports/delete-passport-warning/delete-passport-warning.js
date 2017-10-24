/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/delete-passport-warning delete-passport-warning
 * @parent components.common
 *
 * A short description of the delete-passport-warning component
 *
 * @signature `<delete-passport-warning />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/delete-passport-warning/delete-passport-warning.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/delete-passport-warning/delete-passport-warning.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './delete-passport-warning.less'
import view from './delete-passport-warning.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the delete-passport-warning component'
  }
})

export default Component.extend({
  tag: 'delete-passport-warning',
  ViewModel,
  view
})
