/**
 * @module {can.Component} wallet-ui/components/page-orders page-orders
 * @parent components.common
 *
 * A short description of the page-orders component
 *
 * @signature `<page-orders />`
 *
 * @link ../src/wallet-ui/components/page-orders.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-orders.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-orders.less';
import view from './page-orders.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-orders component'
  }
});

export default Component.extend({
  tag: 'page-orders',
  ViewModel,
  view
});
