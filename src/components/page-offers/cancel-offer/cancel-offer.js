/**
 * @module {can.Component} components/page-offers/cancel-offer cancel-offer
 * @parent components.buy-sell-offers 8
 *
 * Modal shown when wanting to cancel an order.
 *
 * @signature `<cancel-offer />`
 *
 * @link ../src/components/page-offers/cancel-offer/cancel-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/cancel-offer/cancel-offer.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './cancel-offer.less';
import view from './cancel-offer.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the cancel-offer component'
  }
});

export default Component.extend({
  tag: 'cancel-offer',
  ViewModel,
  view
});
