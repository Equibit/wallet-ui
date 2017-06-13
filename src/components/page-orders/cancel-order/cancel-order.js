/**
 * @module {can.Component} wallet-ui/components/page-orders/cancel-order cancel-order
 * @parent components.common
 *
 * A short description of the cancel-order component
 *
 * @signature `<cancel-order />`
 *
 * @link ../src/wallet-ui/components/page-orders/cancel-order/cancel-order.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-orders/cancel-order/cancel-order.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './cancel-order.less';
import view from './cancel-order.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the cancel-order component'
  }
});

export default Component.extend({
  tag: 'cancel-order',
  ViewModel,
  view
});
