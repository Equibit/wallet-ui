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
import DefineMap from 'can-define/map/map'
import './status-badge.less'
import view from './status-badge.stache'
import { translate } from '../../../i18n/i18n'

export const ViewModel = DefineMap.extend({
  status: {
    type: 'string'
  },
  statusLabel: {
    get () {
      const values = {
        open: translate('statusOpen'),
        progress: 'In progress',
        trading: translate('statusTrading'),
        completed: 'Completed',
        closed: translate('statusClosed'),
        cancelled: translate('statusCancelled'),
        rejected: translate('statusRejected'),
        unknown: 'Unknown'
      }
      return values[this.status.toLowerCase()] || values.unknown
    }
  },
  statusClass: {
    get () {
      const values = {
        open: 'info',
        progress: 'progress',
        trading: 'progress',
        completed: 'success',
        closed: 'success',
        cancelled: 'danger',
        rejected: 'default',
        unknown: 'default'
      }
      return values[this.status.toLowerCase()] || values.unknown
    }
  }
})

export default Component.extend({
  tag: 'status-badge',
  ViewModel,
  view
})
