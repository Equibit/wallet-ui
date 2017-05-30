/**
 * @module {can.Component} wallet-ui/components/trade-funds/receive-popup receive-popup
 * @parent components.portfolio
 *
 * A short description of the receive-popup component
 *
 * @signature `<receive-popup />`
 *
 * @link ../src/wallet-ui/components/trade-funds/receive-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/receive-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './receive-popup.less';
import view from './receive-popup.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the receive-popup component'
  }
});

export default Component.extend({
  tag: 'receive-popup',
  ViewModel,
  view
});
