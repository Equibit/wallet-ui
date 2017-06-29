/**
 * @module {can.Component} components/common/status-badge status-badge
 * @parent components.common
 *
 * This component uses the [.label](bootstrap-custom___labels.less.html) class to display in a badge style a status.
 *
 * @signature `<status-badge />`
 *
 * @link ../src/components/common/status-badge/status-badge.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/status-badge/status-badge.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './status-badge.less'
import view from './status-badge.stache'

export const ViewModel = DefineMap.extend({
  status: {
    type: 'string'
  },
  statusLabel: {
    get () {
      const values = {
        progress: 'In progress',
        trading: 'Trading',
        completed: 'Completed',
        canceled: 'Canceled',
        unknown: 'Unknown'
      }
      return values[this.status] || values.unknown
    }
  },
  statusClass: {
    get () {
      const values = {
        progress: 'progress',
        completed: 'success',
        canceled: 'warning',
        unknown: 'default'
      }
      return values[this.status] || values.unknown
    }
  }
})

export default Component.extend({
  tag: 'status-badge',
  ViewModel,
  view
})
