/**
 * @module {can.Component} components/trade-funds/place-order place-order
 * @parent components.buy-sell 1
 *
 * This component shows the modal with the forms for placing a buy or sell order.
 *
 * @signature `<place-order />`
 *
 * @link ../src/components/trade-funds/place-order/place-order.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-order/place-order.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './place-order.less';
import view from './place-order.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the place-order component'
  }
});

export default Component.extend({
  tag: 'place-order',
  ViewModel,
  view
});
