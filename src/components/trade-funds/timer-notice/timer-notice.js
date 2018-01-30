/**
 * @module {can.Component} wallet-ui/components/trade-funds/timer-notice timer-notice
 * @parent components.common
 *
 * A short description of the timer-notice component
 *
 * @signature `<timer-notice />`
 *
 * @link ../src/wallet-ui/components/trade-funds/timer-notice/timer-notice.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/timer-notice/timer-notice.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './timer-notice.less'
import view from './timer-notice.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'accept this offer'
  },
  endTime: 'date'
})

export default Component.extend({
  tag: 'timer-notice',
  ViewModel,
  view
})
