/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/create-passport/passport-confirm passport-confirm
 * @parent components.common
 *
 * A short description of the passport-confirm component
 *
 * @signature `<passport-confirm />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/create-passport/passport-confirm/passport-confirm.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/create-passport/passport-confirm/passport-confirm.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-confirm.less'
import view from './passport-confirm.stache'

export const ViewModel = DefineMap.extend({
  passport: {}
})

export default Component.extend({
  tag: 'passport-confirm',
  ViewModel,
  view
})
