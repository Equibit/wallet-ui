/**
 * @module {can.Component} wallet-ui/components/page-orders/order-details order-details
 * @parent components.common
 *
 * A short description of the order-details component
 *
 * @signature `<order-details />`
 *
 * @link ../src/wallet-ui/components/page-orders/order-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-orders/order-details.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './order-details.less';
import view from './order-details.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the order-details component'
  }
});

export default Component.extend({
  tag: 'order-details',
  ViewModel,
  view
});
