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
  rows: {
    value: _.times(10, (i) => {
      return {
        quantity: 100 * i,
        price: 70 * i,
        date: '13:47',
        partial: ['YES', 'NO'][i % 2]
      };
    })
  },
  buy (id) {
    return;
  }
});

export default Component.extend({
  tag: 'sell-orders',
  ViewModel,
  view
});
