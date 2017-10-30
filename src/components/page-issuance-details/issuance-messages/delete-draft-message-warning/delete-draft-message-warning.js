/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-messages/delete-draft-message-warning delete-draft-message-warning
 * @parent components.common
 *
 * A short description of the delete-draft-message-warning component
 *
 * @signature `<delete-draft-message-warning />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-messages/delete-draft-message-warning/delete-draft-message-warning.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-messages/delete-draft-message-warning/delete-draft-message-warning.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './delete-draft-message-warning.less'
import view from './delete-draft-message-warning.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the delete-draft-message-warning component'
  }
})

export default Component.extend({
  tag: 'delete-draft-message-warning',
  ViewModel,
  view
})
