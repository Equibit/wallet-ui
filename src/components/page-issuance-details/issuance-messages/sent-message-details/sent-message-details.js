/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-messages/sent-message-details sent-message-details
 * @parent components.common
 *
 * A short description of the sent-message-details component
 *
 * @signature `<sent-message-details />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-messages/sent-message-details/sent-message-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-messages/sent-message-details/sent-message-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './sent-message-details.less'
import view from './sent-message-details.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the sent-message-details component'
  }
})

export default Component.extend({
  tag: 'sent-message-details',
  ViewModel,
  view
})
