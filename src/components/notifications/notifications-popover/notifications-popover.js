/**
 * @module {can.Component} components/notifications/notifications-popover notifications-popover
 * @parent components.notifications
 *
 * Shows a list of alerts (`<notifications-list>`) inside of a popover that uses the [dropdown](components__common__dropdown.html)
 * component.
 *
 * @signature `<notifications-popover />`
 *
 * @link ../src/components/notifications/notifications-popover/notifications-popover.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/notifications/notifications-popover/notifications-popover.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './notifications-popover.less';
import view from './notifications-popover.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the notifications-popover component'
  }
});

export default Component.extend({
  tag: 'notifications-popover',
  ViewModel,
  view
});
