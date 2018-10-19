/**
 * @module {can.Component} wallet-ui/src/components/common/time-remaining time-remaining
 * @parent components.common
 *
 * A short description of the time-remaining component
 *
 * @signature `<time-remaining />`
 *
 * @link ../src/wallet-ui/src/components/common/time-remaining/time-remaining.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/src/components/common/time-remaining/time-remaining.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './time-remaining.less'
import view from './time-remaining.stache'

export const ViewModel = DefineMap.extend({
  status: {
    type: 'string',
    value: 'active',
    set (val) {
      if (val === 'active') {
        this.intervalVal = this.interval()
        return val
      } else {
        clearInterval(this.intervalVal)
        this.intervalVal = null
        return 'pending'
      }
    }
  },
  endTime: 'date',
  timeInterval: {
    type: 'number',
    value: 0
  },
  currentTime: {
    type: 'number',
    value: function () {
      return Date.now()
    }
  },
  get hm () {
    const timeLeft = this.endTime
      ? Math.floor((this.endTime.getTime() - this.currentTime) / 1000)
      : Math.floor(this.timeInterval / 1000)
    if (timeLeft <= 0) {
      return '00:00'
    } else {
      const s = timeLeft % 60
      const m = (timeLeft - s) / 60 % 60
      const h = ((timeLeft - s) / 60 - m) / 60
      return [h, m].map(n => n.toString(10).padStart(2, '0')).join(':')
    }
  },
  intervalVal: '*',
  interval: {
    type: '*',
    default () {
      return () => setInterval(() => {
        const prevTime = this.currentTime
        this.currentTime = Date.now()
        if (this.endTime &&
          this.currentTime >= this.endTime &&
          prevTime < this.endTime &&
          this.timeExpiredHandler
        ) {
          this.timeExpiredHandler()
        }
      }, 1000)
    }
  },
  // Callback for 'active' status timers.  When the timer hits zero,
  timeExpiredHandler: '*'
})

export default Component.extend({
  tag: 'time-remaining',
  ViewModel,
  view,
  events: {
    ' beforeRemove': function () {
      clearInterval(this.viewModel.interval)
    }
  }
})
