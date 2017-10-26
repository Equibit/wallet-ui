/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/remove-passport-warning remove-passport-warning
 * @parent components.common
 *
 * A short description of the remove-passport-warning component
 *
 * @signature `<remove-passport-warning />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/remove-passport-warning/remove-passport-warning.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/remove-passport-warning/remove-passport-warning.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './remove-passport-warning.less'
import view from './remove-passport-warning.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the remove-passport-warning component'
  }
})

export default Component.extend({
  tag: 'remove-passport-warning',
  ViewModel,
  view
})
