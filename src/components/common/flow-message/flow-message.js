/**
 * @module {can.Component} components/common/flow-message flow-message
 * @parent components.common
 *
 * This component shows the message for a step in a process.
 * There are 5 types:
 * - Success
 * - Pending
 * - Warning
 * - Exchange (shows the quantity and price of the item to be exchanged)
 * - Final (shown when the process is completed)
 *
 * @signature `<flow-message />`
 *
 * @link ../src/components/common/flow-message/flow-message.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/flow-message/flow-message.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './flow-message.less';
import view from './flow-message.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the flow-message component'
  }
});

export default Component.extend({
  tag: 'flow-message',
  ViewModel,
  view
});
