/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/accept-trading-passport accept-trading-passport
 * @parent components.common
 *
 * A short description of the accept-trading-passport component
 *
 * @signature `<accept-trading-passport />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/accept-trading-passport/accept-trading-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/accept-trading-passport/accept-trading-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './accept-trading-passport.less'
import view from './accept-trading-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the accept-trading-passport component'
  }
})

export default Component.extend({
  tag: 'accept-trading-passport',
  ViewModel,
  view
})
