/**
 * @module {can.Component} components/sell-orders sell-orders
 * @parent components.common
 *
 * Issuance Details / Order Book / Sell Orders
 *
 * @signature `<sell-orders />`
 *
 * @link ../src/components/page-issuance-details/sell-orders/sell-orders.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/sell-orders/sell-orders.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './sell-orders.less';
import view from './sell-orders.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the sell-orders component'
  }
});

export default Component.extend({
  tag: 'sell-orders',
  ViewModel,
  view
});
