/**
 * @module {can.Component} wallet-ui/components/trade-funds/confirm-summary confirm-summary
 * @parent components.common
 *
 * A short description of the confirm-summary component
 *
 * @signature `<confirm-summary />`
 *
 * @link ../src/wallet-ui/components/trade-funds/confirm-summary/confirm-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/confirm-summary/confirm-summary.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './confirm-summary.less'
import view from './confirm-summary.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the confirm-summary component'
  }
})

export default Component.extend({
  tag: 'confirm-summary',
  ViewModel,
  view
})
