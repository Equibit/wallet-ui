/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution schedule-distribution
 * @parent components.common
 *
 * A short description of the schedule-distribution component
 *
 * @signature `<schedule-distribution />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/schedule-distribution.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/schedule-distribution.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './schedule-distribution.less'
import view from './schedule-distribution.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the schedule-distribution component'
  },
  mode: {
    type: 'string',
    value: 'edit'
  },
  edit () {
    this.mode = 'edit'
  },
  confirm () {
    this.mode = 'confirm'
  }
})

export default Component.extend({
  tag: 'schedule-distribution',
  ViewModel,
  view
})
