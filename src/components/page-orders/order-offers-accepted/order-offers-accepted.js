/**
 * @module {can.Component} components/page-orders/order-offers-accepted order-offers-accepted
 * @parent components.buy-sell 4
 *
 * This component shows accepted offers from an order.
 *
 * @signature `<order-offers-accepted />`
 *
 * @link ../src/components/page-orders/order-offers-accepted/order-offers-accepted.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/order-offers-accepted/order-offers-accepted.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './order-offers-accepted.less';
import view from './order-offers-accepted.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the order-offers-accepted component'
  }
});

export default Component.extend({
  tag: 'order-offers-accepted',
  ViewModel,
  view
});
