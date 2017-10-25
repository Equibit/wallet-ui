/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/revoke-investor-passport revoke-investor-passport
 * @parent components.common
 *
 * A short description of the revoke-investor-passport component
 *
 * @signature `<revoke-investor-passport />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/revoke-investor-passport/revoke-investor-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/revoke-investor-passport/revoke-investor-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './revoke-investor-passport.less'
import view from './revoke-investor-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the revoke-investor-passport component'
  }
})

export default Component.extend({
  tag: 'revoke-investor-passport',
  ViewModel,
  view
})
