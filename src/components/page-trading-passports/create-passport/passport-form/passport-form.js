/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/create-passport/passport-form passport-form
 * @parent components.common
 *
 * A short description of the passport-form component
 *
 * @signature `<passport-form />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/create-passport/passport-form/passport-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/create-passport/passport-form/passport-form.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-form.less'
import view from './passport-form.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the passport-form component'
  }
})

export default Component.extend({
  tag: 'passport-form',
  ViewModel,
  view
})
