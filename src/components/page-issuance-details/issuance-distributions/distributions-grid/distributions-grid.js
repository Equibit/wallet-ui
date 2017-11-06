/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-distributions/distributions-grid distributions-grid
 * @parent components.common
 *
 * A short description of the distributions-grid component
 *
 * @signature `<distributions-grid />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-distributions/distributions-grid/distributions-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-distributions/distributions-grid/distributions-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './distributions-grid.less'
import view from './distributions-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the distributions-grid component'
  }
})

export default Component.extend({
  tag: 'distributions-grid',
  ViewModel,
  view
})
