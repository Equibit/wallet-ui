/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/manage-accepted-trading-passports manage-accepted-trading-passports
 * @parent components.common
 *
 * A short description of the manage-accepted-trading-passports component
 *
 * @signature `<manage-accepted-trading-passports />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/manage-accepted-trading-passports.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/manage-accepted-trading-passports.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './manage-accepted-trading-passports.less'
import view from './manage-accepted-trading-passports.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the manage-accepted-trading-passports component'
  }
})

export default Component.extend({
  tag: 'manage-accepted-trading-passports',
  ViewModel,
  view
})
