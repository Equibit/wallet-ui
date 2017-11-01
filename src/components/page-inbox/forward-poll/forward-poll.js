/**
 * @module {can.Component} wallet-ui/components/page-inbox/forward-poll forward-poll
 * @parent components.common
 *
 * A short description of the forward-poll component
 *
 * @signature `<forward-poll />`
 *
 * @link ../src/wallet-ui/components/page-inbox/forward-poll/forward-poll.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/forward-poll/forward-poll.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './forward-poll.less'
import view from './forward-poll.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the forward-poll component'
  }
})

export default Component.extend({
  tag: 'forward-poll',
  ViewModel,
  view
})
