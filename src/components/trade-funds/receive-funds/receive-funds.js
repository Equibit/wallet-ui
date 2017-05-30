/**
 * @module {can.Component} wallet-ui/components/trade-funds/receive-funds receive-funds
 * @parent components.portfolio
 *
 * A short description of the receive-funds component
 *
 * @signature `<receive-funds />`
 *
 * @link ../src/wallet-ui/components/trade-funds/receive-funds.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/receive-funds.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './receive-funds.less';
import view from './receive-funds.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the receive-funds component'
  }
});

export default Component.extend({
  tag: 'receive-funds',
  ViewModel,
  view
});
