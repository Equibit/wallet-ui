/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/create-issuance/issuance-confirm issuance-confirm
 * @parent components.common
 *
 * A short description of the issuance-confirm component
 *
 * @signature `<issuance-confirm />`
 *
 * @link ../src/wallet-ui/components/page-my-issuances/create-issuance/issuance-confirm/issuance-confirm.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/create-issuance/issuance-confirm/issuance-confirm.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-confirm.less'
import view from './issuance-confirm.stache'

export const ViewModel = DefineMap.extend({
  formData: '*',
  get issuance () {
    return this.formData.issuance
  },
  get company () {
    return this.issuance.selectedCompany
  }
})

export default Component.extend({
  tag: 'issuance-confirm',
  ViewModel,
  view
})
