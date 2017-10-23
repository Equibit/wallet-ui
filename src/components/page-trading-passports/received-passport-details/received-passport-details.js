/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/received-passport-details received-passport-details
 * @parent components.common
 *
 * A short description of the received-passport-details component
 *
 * @signature `<received-passport-details />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/received-passport-details/received-passport-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/received-passport-details/received-passport-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './received-passport-details.less'
import view from './received-passport-details.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the received-passport-details component'
  }
})

export default Component.extend({
  tag: 'received-passport-details',
  ViewModel,
  view
})
