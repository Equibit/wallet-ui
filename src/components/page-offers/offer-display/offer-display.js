/**
 * @module {can.Component} components/page-offers/offer-display offer-display
 * @parent components.buy-sell 8
 *
 * A short description of the offer-display component
 *
 * @signature `<offer-display />`
 *
 * @link ../src/components/page-offers/offer-display/offer-display.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-display/offer-display.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './offer-display.less';
import view from './offer-display.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-display component'
  }
});

export default Component.extend({
  tag: 'offer-display',
  ViewModel,
  view
});
