/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-funds send-funds
 * @parent components.common
 *
 * A short description of the send-funds component
 *
 * @signature `<send-funds />`
 *
 * @link ../src/wallet-ui/components/trade-funds/send-funds.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/send-funds.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-funds.less';
import view from './send-funds.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the send-funds component'
  }
});

export default Component.extend({
  tag: 'send-funds',
  ViewModel,
  view
});
