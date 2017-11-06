/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-distributions issuance-distributions
 * @parent components.common
 *
 * A short description of the issuance-distributions component
 *
 * @signature `<issuance-distributions />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-distributions/issuance-distributions.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-distributions/issuance-distributions.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-distributions.less'
import view from './issuance-distributions.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-distributions component'
  }
})

export default Component.extend({
  tag: 'issuance-distributions',
  ViewModel,
  view
})
