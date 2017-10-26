/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport-selector issuance-add-passport-selector
 * @parent components.common
 *
 * A short description of the issuance-add-passport-selector component
 *
 * @signature `<issuance-add-passport-selector />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport-selector/issuance-add-passport-selector.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport-selector/issuance-add-passport-selector.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-add-passport-selector.less'
import view from './issuance-add-passport-selector.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-add-passport-selector component'
  }
})

export default Component.extend({
  tag: 'issuance-add-passport-selector',
  ViewModel,
  view
})
