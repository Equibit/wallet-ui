/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/remove-issuance-passport remove-issuance-passport
 * @parent components.common
 *
 * A short description of the remove-issuance-passport component
 *
 * @signature `<remove-issuance-passport />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/remove-issuance-passport/remove-issuance-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/remove-issuance-passport/remove-issuance-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './remove-issuance-passport.less'
import view from './remove-issuance-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the remove-issuance-passport component'
  }
})

export default Component.extend({
  tag: 'remove-issuance-passport',
  ViewModel,
  view
})
