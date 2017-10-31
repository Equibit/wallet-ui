/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-polls/sent-poll-details sent-poll-details
 * @parent components.common
 *
 * A short description of the sent-poll-details component
 *
 * @signature `<sent-poll-details />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-polls/sent-poll-details/sent-poll-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-polls/sent-poll-details/sent-poll-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './sent-poll-details.less'
import view from './sent-poll-details.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the sent-poll-details component'
  }
})

export default Component.extend({
  tag: 'sent-poll-details',
  ViewModel,
  view
})
