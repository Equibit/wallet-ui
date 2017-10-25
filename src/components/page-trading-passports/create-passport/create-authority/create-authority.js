/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/create-passport/create-authority create-authority
 * @parent components.common
 *
 * A short description of the create-authority component
 *
 * @signature `<create-authority />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/create-passport/create-authority/create-authority.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/create-passport/create-authority/create-authority.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-authority.less'
import view from './create-authority.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the create-authority component'
  }
})

export default Component.extend({
  tag: 'create-authority',
  ViewModel,
  view
})
