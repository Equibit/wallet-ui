/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-form distribution-form
 * @parent components.common
 *
 * A short description of the distribution-form component
 *
 * @signature `<distribution-form />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-form/distribution-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-form/distribution-form.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './distribution-form.less'
import view from './distribution-form.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the distribution-form component'
  },
  datepickerOptions: {
    type: '*',
    value () {
      return {
        format: 'MM/DD/YYYY'
      }
    }
  }
})

export default Component.extend({
  tag: 'distribution-form',
  ViewModel,
  view
})
