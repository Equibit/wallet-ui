/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/passport-add-issuance-selector passport-add-issuance-selector
 * @parent components.common
 *
 * A short description of the passport-add-issuance-selector component
 *
 * @signature `<passport-add-issuance-selector />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/passport-add-issuance-selector/passport-add-issuance-selector.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/passport-add-issuance-selector/passport-add-issuance-selector.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-add-issuance-selector.less'
import view from './passport-add-issuance-selector.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the passport-add-issuance-selector component'
  }
})

export default Component.extend({
  tag: 'passport-add-issuance-selector',
  ViewModel,
  view
})
