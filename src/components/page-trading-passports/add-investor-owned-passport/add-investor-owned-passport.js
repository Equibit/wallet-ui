/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/add-investor-owned-passport add-investor-owned-passport
 * @parent components.common
 *
 * A short description of the add-investor-owned-passport component
 *
 * @signature `<add-investor-owned-passport />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/add-investor-owned-passport/add-investor-owned-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/add-investor-owned-passport/add-investor-owned-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './add-investor-owned-passport.less'
import view from './add-investor-owned-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the add-investor-owned-passport component'
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
  tag: 'add-investor-owned-passport',
  ViewModel,
  view
})
