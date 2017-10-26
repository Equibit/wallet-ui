/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport issuance-add-passport
 * @parent components.common
 *
 * A short description of the issuance-add-passport component
 *
 * @signature `<issuance-add-passport />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport/issuance-add-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport/issuance-add-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-add-passport.less'
import view from './issuance-add-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-add-passport component'
  },
  mode: {
    value: 'prompt'
  },
  prompt () {
    this.mode = 'prompt'
  },
  edit () {
    this.mode = 'edit'
  }
})

export default Component.extend({
  tag: 'issuance-add-passport',
  ViewModel,
  view
})
