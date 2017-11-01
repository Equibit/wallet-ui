/**
 * @module {can.Component} wallet-ui/components/page-inbox/forward-poll/forwarded-poll forwarded-poll
 * @parent components.common
 *
 * A short description of the forwarded-poll component
 *
 * @signature `<forwarded-poll />`
 *
 * @link ../src/wallet-ui/components/page-inbox/forward-poll/forwarded-poll/forwarded-poll.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/forward-poll/forwarded-poll/forwarded-poll.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './forwarded-poll.less'
import view from './forwarded-poll.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the forwarded-poll component'
  }
})

export default Component.extend({
  tag: 'forwarded-poll',
  ViewModel,
  view
})
