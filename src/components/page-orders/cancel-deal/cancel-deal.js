/**
 * @module {can.Component} components/page-orders/cancel-deal cancel-deal
 * @parent components.buy-sell 11
 *
 * Modal shown when wanting to cancel a deal that is in progress inside of an order.
 *
 * @signature `<cancel-deal />`
 *
 * @link ../src/components/page-orders/cancel-deal/cancel-deal.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-orders/cancel-deal/cancel-deal.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './cancel-deal.less';
import view from './cancel-deal.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the cancel-deal component'
  }
});

export default Component.extend({
  tag: 'cancel-deal',
  ViewModel,
  view
});
