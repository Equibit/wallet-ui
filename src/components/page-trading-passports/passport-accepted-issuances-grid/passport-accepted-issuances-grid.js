/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/passport-accepted-issuances-grid passport-accepted-issuances-grid
 * @parent components.common
 *
 * A short description of the passport-accepted-issuances-grid component
 *
 * @signature `<passport-accepted-issuances-grid />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/passport-accepted-issuances-grid/passport-accepted-issuances-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/passport-accepted-issuances-grid/passport-accepted-issuances-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-accepted-issuances-grid.less'
import view from './passport-accepted-issuances-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the passport-accepted-issuances-grid component'
  }
})

export default Component.extend({
  tag: 'passport-accepted-issuances-grid',
  ViewModel,
  view
})
