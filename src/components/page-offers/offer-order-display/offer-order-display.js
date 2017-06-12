/**
 * @module {can.Component} components/page-offers/offer-order-display offer-order-display
 * @parent components.buy-sell 10
 *
 * Shows the details of an order for an offer.
 *
 * @signature `<offer-order-display />`
 *
 * @link ../src/components/page-offers/offer-order-display/offer-order-display.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-order-display/offer-order-display.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './offer-order-display.less';
import view from './offer-order-display.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-order-display component'
  }
});

export default Component.extend({
  tag: 'offer-order-display',
  ViewModel,
  view
});
