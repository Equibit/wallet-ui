/**
 * @module {can.Component} components/notifications/notification-indicator notification-indicator
 * @parent components.notifications
 *
 * Shows a badge indicator with the number of unopen alerts.
 *
 * @signature `<notification-indicator />`
 *
 * @link ../src/components/notifications/notification-indicator/notification-indicator.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/notifications/notification-indicator/notification-indicator.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './notification-indicator.less';
import view from './notification-indicator.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the notification-indicator component'
  }
});

export default Component.extend({
  tag: 'notification-indicator',
  ViewModel,
  view
});
