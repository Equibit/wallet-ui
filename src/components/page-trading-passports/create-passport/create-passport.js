/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/create-passport create-passport
 * @parent components.common
 *
 * A short description of the create-passport component
 *
 * @signature `<create-passport />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/create-passport/create-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/create-passport/create-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-passport.less'
import view from './create-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the create-passport component'
  }
})

export default Component.extend({
  tag: 'create-passport',
  ViewModel,
  view
})
