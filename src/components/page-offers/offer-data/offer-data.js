/**
 * @module {can.Component} components/page-offers/offer-data offer-details > offer-data
 * @parent components.buy-sell 8
 *
 * A short description of the offer-data component
 *
 * @signature `<offer-data />`
 *
 * @link ../src/components/page-offers/offer-data/offer-data.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-data/offer-data.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './offer-data.less';
import view from './offer-data.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-data component'
  }
});

export default Component.extend({
  tag: 'offer-data',
  ViewModel,
  view
});
