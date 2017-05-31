/**
 * @module {can.Component} components/page-orders/order-list order-list
 * @parent components.buy-sell
 *
 * This component shows the information about an order.
 *
 * @signature `<order-list />`
 *
 * @link ../src/components/page-orders/order-list/order-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-list/order-list.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './order-list.less';
import view from './order-list.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the order-list component'
  }
});

export default Component.extend({
  tag: 'order-list',
  ViewModel,
  view
});
