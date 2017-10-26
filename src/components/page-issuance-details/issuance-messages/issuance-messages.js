/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-messages issuance-messages
 * @parent components.common
 *
 * A short description of the issuance-messages component
 *
 * @signature `<issuance-messages />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-messages/issuance-messages.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-messages/issuance-messages.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-messages.less'
import view from './issuance-messages.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-messages component'
  }
})

export default Component.extend({
  tag: 'issuance-messages',
  ViewModel,
  view
})
