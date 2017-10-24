/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/add-issuance-owned-passport add-issuance-owned-passport
 * @parent components.common
 *
 * A short description of the add-issuance-owned-passport component
 *
 * @signature `<add-issuance-owned-passport />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/add-issuance-owned-passport/add-issuance-owned-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/add-issuance-owned-passport/add-issuance-owned-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './add-issuance-owned-passport.less'
import view from './add-issuance-owned-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the add-issuance-owned-passport component'
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
  tag: 'add-issuance-owned-passport',
  ViewModel,
  view
})
