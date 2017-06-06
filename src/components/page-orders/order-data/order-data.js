/**
 * @module {can.Component} components/page-orders/order-data order-data
 * @parent components.buy-sell 2
 *
 * A short description of the order-data component
 *
 * @signature `<order-data />`
 *
 * @link ../src/components/page-orders/order-data/order-data.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-data/order-data.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './order-data.less';
import view from './order-data.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the order-data component'
  }
});

export default Component.extend({
  tag: 'order-data',
  ViewModel,
  view
});
