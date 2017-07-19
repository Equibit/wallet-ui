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
import Notification from '../../../models/notification'
import Session from '../../../models/session'
import route from 'can-route'

export const ViewModel = DefineMap.extend({
  notifications: {
    Type: Notification.List
  },
  title (type) {
    return ({
      'IN': 'Transfer Received'
    })[type] || ('Unknown Type ' + type)
  },
  for (addr) {
    const portfolio = Session.current && Session.current.portfolios && Session.current.portfolios.findByAddress(addr)
    return (portfolio && portfolio.name) || addr
  },
  read (notification) {
    notification.isRead = true
  }
})

export default Component.extend({
  tag: 'notifications-list',
  ViewModel,
  view
})
