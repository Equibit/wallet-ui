/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/issuance-list issuance-list
 * @parent components.common
 *
 * A short description of the issuance-list component
 *
 * @signature `<issuance-list />`
 *
 * @link ../src/wallet-ui/components/page-my-issuances/issuance-list/issuance-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/issuance-list/issuance-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-list.less'
import view from './issuance-list.stache'

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  showModal () {
    this.isModalShown = false
    this.isModalShown = true
  }
})

export default Component.extend({
  tag: 'issuance-list',
  ViewModel,
  view
})
