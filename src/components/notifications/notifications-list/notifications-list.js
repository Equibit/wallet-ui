/**
 * @module {can.Component} components/notifications/notifications-list notifications-list
 * @parent components.notifications
 *
 * Shows a list of alerts.
 *
 * @signature `<notifications-list />`
 *
 * @link ../src/components/notifications/notifications-list/notifications-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/notifications/notifications-list/notifications-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './notifications-list.less'
import view from './notifications-list.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the notifications-list component'
  }
})

export default Component.extend({
  tag: 'notifications-list',
  ViewModel,
  view
})
