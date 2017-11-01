/**
 * @module {can.Component} wallet-ui/components/page-inbox/poll-details poll-details
 * @parent components.common
 *
 * A short description of the poll-details component
 *
 * @signature `<poll-details />`
 *
 * @link ../src/wallet-ui/components/page-inbox/poll-details/poll-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/poll-details/poll-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './poll-details.less'
import view from './poll-details.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the poll-details component'
  }
})

export default Component.extend({
  tag: 'poll-details',
  ViewModel,
  view
})
