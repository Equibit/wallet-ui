/**
 * @module {can.Component} wallet-ui/components/page-orders/order-offers-data order-offers-data
 * @parent components.buy-sell
 *
 * This component shows the list of offers available for an order using an accordion style container.
 *
 * @signature `<order-offers-data />`
 *
 * @link ../src/components/page-orders/order-offers-data/order-offers-data.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-offers-data/order-offers-data.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './order-offers-data.less';
import view from './order-offers-data.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the order-offers-data component'
  }
});

export default Component.extend({
  tag: 'order-offers-data',
  ViewModel,
  view
});
