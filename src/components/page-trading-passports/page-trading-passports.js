/**
 * @module {can.Component} wallet-ui/components/page-trading-passports page-trading-passports
 * @parent components.common
 *
 * A short description of the page-trading-passports component
 *
 * @signature `<page-trading-passports />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/page-trading-passports.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/page-trading-passports.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-trading-passports.less'
import view from './page-trading-passports.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-trading-passports component'
  }
})

export default Component.extend({
  tag: 'page-trading-passports',
  ViewModel,
  view
})
