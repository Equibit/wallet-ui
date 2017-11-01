/**
 * @module {can.Component} wallet-ui/components/page-inbox/message-details message-details
 * @parent components.common
 *
 * A short description of the message-details component
 *
 * @signature `<message-details />`
 *
 * @link ../src/wallet-ui/components/page-inbox/message-details/message-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/message-details/message-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './message-details.less'
import view from './message-details.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the message-details component'
  }
})

export default Component.extend({
  tag: 'message-details',
  ViewModel,
  view
})
