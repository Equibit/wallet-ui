/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/create-issuance/issuance-form issuance-form
 * @parent components.common
 *
 * A short description of the issuance-form component
 *
 * @signature `<issuance-form />`
 *
 * @link ../src/wallet-ui/components/page-my-issuances/create-issuance/issuance-form/issuance-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/create-issuance/issuance-form/issuance-form.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-form.less'
import view from './issuance-form.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-form component'
  }
})

export default Component.extend({
  tag: 'issuance-form',
  ViewModel,
  view
})
