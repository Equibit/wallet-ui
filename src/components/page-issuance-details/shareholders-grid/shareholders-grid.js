/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/shareholders-grid shareholders-grid
 * @parent components.common
 *
 * A short description of the shareholders-grid component
 *
 * @signature `<shareholders-grid />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/shareholders-grid/shareholders-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/shareholders-grid/shareholders-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './shareholders-grid.less'
import view from './shareholders-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the shareholders-grid component'
  }
})

export default Component.extend({
  tag: 'shareholders-grid',
  ViewModel,
  view
})
