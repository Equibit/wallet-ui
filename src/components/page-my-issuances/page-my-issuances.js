/**
 * @module {can.Component} wallet-ui/components/page-my-issuances page-my-issuances
 * @parent components.common
 *
 * My Issuances page with a list of issuances of the logged-in user
 *
 * @signature `<page-my-issuances />`
 *
 * @link ../src/components/page-my-issuances/page-my-issuances.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-my-issuances/page-my-issuances.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-my-issuances.less'
import view from './page-my-issuances.stache'
import Issuance from '../../models/issuance'

export const ViewModel = DefineMap.extend({
  isIssuacePopupVisible: 'boolean',
  issuances: {
    Type: Issuance.List
  },
  addIssuance () {
    this.isIssuacePopupVisible = false
    this.isIssuacePopupVisible = true
  },
  createIssuance (data={}) {
    this.issuances.push(data)
    this.isIssuacePopupVisible = false
  }
})

export default Component.extend({
  tag: 'page-my-issuances',
  ViewModel,
  view
})
