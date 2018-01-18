/**
 * @module {can.Component} wallet-ui/components/page-transactions/transactions-grid/trade-row trade-row
 * @parent components.common
 *
 * A short description of the trade-row component
 *
 * @signature `<trade-row />`
 *
 * @link ../src/wallet-ui/components/page-transactions/transactions-grid/trade-row/trade-row.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-transactions/transactions-grid/trade-row/trade-row.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './trade-row.less'
import view from './trade-row.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the trade-row component'
  }
})

export default Component.extend({
  tag: 'trade-row',
  ViewModel,
  view
})
