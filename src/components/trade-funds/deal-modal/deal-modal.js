/**
 * @module {can.Component} wallet-ui/components/trade-funds/deal-modal deal-modal
 * @parent components.common
 *
 * A short description of the deal-modal component
 *
 * @signature `<deal-modal />`
 *
 * @link ../src/wallet-ui/components/trade-funds/deal-modal/deal-modal.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/deal-modal/deal-modal.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './deal-modal.less'
import view from './deal-modal.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the deal-modal component'
  }
})

export default Component.extend({
  tag: 'deal-modal',
  ViewModel,
  view
})
