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
  issuances: {
    Type: Issuance.List
  }
})

export default Component.extend({
  tag: 'page-my-issuances',
  ViewModel,
  view
})
