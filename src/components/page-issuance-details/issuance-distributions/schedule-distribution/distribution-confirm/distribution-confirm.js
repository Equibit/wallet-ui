/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-confirm distribution-confirm
 * @parent components.common
 *
 * A short description of the distribution-confirm component
 *
 * @signature `<distribution-confirm />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-confirm/distribution-confirm.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-confirm/distribution-confirm.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './distribution-confirm.less'
import view from './distribution-confirm.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the distribution-confirm component'
  }
})

export default Component.extend({
  tag: 'distribution-confirm',
  ViewModel,
  view
})
