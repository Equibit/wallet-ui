/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-polls/create-poll create-poll
 * @parent components.common
 *
 * A short description of the create-poll component
 *
 * @signature `<create-poll />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-polls/create-poll/create-poll.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-polls/create-poll/create-poll.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-poll.less'
import view from './create-poll.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the create-poll component'
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
  tag: 'create-poll',
  ViewModel,
  view
})
