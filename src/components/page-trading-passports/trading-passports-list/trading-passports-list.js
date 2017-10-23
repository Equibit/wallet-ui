/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/trading-passports-list trading-passports-list
 * @parent components.common
 *
 * A short description of the trading-passports-list component
 *
 * @signature `<trading-passports-list />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/trading-passports-list/trading-passports-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/trading-passports-list/trading-passports-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './trading-passports-list.less'
import view from './trading-passports-list.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the trading-passports-list component'
  }
})

export default Component.extend({
  tag: 'trading-passports-list',
  ViewModel,
  view
})
