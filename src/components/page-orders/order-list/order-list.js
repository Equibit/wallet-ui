/**
 * @module {can.Component} wallet-ui/components/page-orders/order-list order-list
 * @parent components.common
 *
 * A short description of the order-list component
 *
 * @signature `<order-list />`
 *
 * @link ../src/wallet-ui/components/page-orders/order-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-orders/order-list.html
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
