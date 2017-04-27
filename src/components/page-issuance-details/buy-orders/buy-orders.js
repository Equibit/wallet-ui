/**
 * @module {can.Component} components/buy-orders buy-orders
 * @parent components.common
 *
 * Issuance Details / Order Book / Buy Orders
 *
 * @signature `<buy-orders />`
 *
 * @link ../src/components/page-issuance-details/buy-orders/buy-orders.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/buy-orders/buy-orders.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './buy-orders.less';
import view from './buy-orders.stache';
import _ from 'lodash';

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
  sell (id) {

  }
});

export default Component.extend({
  tag: 'buy-orders',
  ViewModel,
  view
});
