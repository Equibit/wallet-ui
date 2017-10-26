/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/passport-owned-accepted-grid passport-owned-accepted-grid
 * @parent components.common
 *
 * A short description of the passport-owned-accepted-grid component
 *
 * @signature `<passport-owned-accepted-grid />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/passport-owned-accepted-grid/passport-owned-accepted-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/passport-owned-accepted-grid/passport-owned-accepted-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-owned-accepted-grid.less'
import view from './passport-owned-accepted-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the passport-owned-accepted-grid component'
  }
})

export default Component.extend({
  tag: 'passport-owned-accepted-grid',
  ViewModel,
  view
})
