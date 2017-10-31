/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-polls/delete-draft-poll-warning delete-draft-poll-warning
 * @parent components.common
 *
 * A short description of the delete-draft-poll-warning component
 *
 * @signature `<delete-draft-poll-warning />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-polls/delete-draft-poll-warning/delete-draft-poll-warning.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-polls/delete-draft-poll-warning/delete-draft-poll-warning.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './delete-draft-poll-warning.less'
import view from './delete-draft-poll-warning.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the delete-draft-poll-warning component'
  }
})

export default Component.extend({
  tag: 'delete-draft-poll-warning',
  ViewModel,
  view
})
