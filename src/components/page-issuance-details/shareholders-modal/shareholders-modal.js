/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/shareholders-modal shareholders-modal
 * @parent components.common
 *
 * A short description of the shareholders-modal component
 *
 * @signature `<shareholders-modal />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/shareholders-modal/shareholders-modal.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/shareholders-modal/shareholders-modal.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './shareholders-modal.less'
import view from './shareholders-modal.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the shareholders-modal component'
  }
})

export default Component.extend({
  tag: 'shareholders-modal',
  ViewModel,
  view
})
