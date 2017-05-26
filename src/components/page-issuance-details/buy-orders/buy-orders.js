/**
 * @module {can.Component} components/buy-orders buy-orders
 * @parent components.issuances
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
import BuyOrder from '~/models/sell-order';

// TODO: turn FIXTURES OFF
import '~/models/fixtures/sell-order';

export const ViewModel = DefineMap.extend({
  limit: 'number',
  rowsPromise: {
    get () {
      let params = this.limit ? {
        $limit: this.limit,
        $skip: 0
      } : {};
      return BuyOrder.getList(params);
    }
  },
  rows: {
    get (lastVal, resolve) {
      this.rowsPromise.then(resolve);
    }
  }
});

export default Component.extend({
  tag: 'buy-orders',
  ViewModel,
  view
});
