/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/passport-owned-accepted-investors-grid passport-owned-accepted-investors-grid
 * @parent components.common
 *
 * A short description of the passport-owned-accepted-investors-grid component
 *
 * @signature `<passport-owned-accepted-investors-grid />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/passport-owned-accepted-investors-grid/passport-owned-accepted-investors-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/passport-owned-accepted-investors-grid/passport-owned-accepted-investors-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-owned-accepted-investors-grid.less'
import view from './passport-owned-accepted-investors-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the passport-owned-accepted-investors-grid component'
  }
})

export default Component.extend({
  tag: 'passport-owned-accepted-investors-grid',
  ViewModel,
  view
})
