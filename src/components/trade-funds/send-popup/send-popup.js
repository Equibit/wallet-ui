/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup send-popup
 * @parent components.common
 *
 * A short description of the send-popup component
 *
 * @signature `<send-popup />`
 *
 * @link ../src/wallet-ui/components/trade-funds/send-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/send-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-popup.less';
import view from './send-popup.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the send-popup component'
  }
});

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
});
