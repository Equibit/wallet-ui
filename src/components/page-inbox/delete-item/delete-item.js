/**
 * @module {can.Component} wallet-ui/components/page-inbox/delete-item delete-item
 * @parent components.common
 *
 * A short description of the delete-item component
 *
 * @signature `<delete-item />`
 *
 * @link ../src/wallet-ui/components/page-inbox/delete-item/delete-item.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/delete-item/delete-item.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './delete-item.less'
import view from './delete-item.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the delete-item component'
  }
})

export default Component.extend({
  tag: 'delete-item',
  ViewModel,
  view
})
