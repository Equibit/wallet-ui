/**
 * @module {can.Component} components/page-offers/offer-details offer-details
 * @parent components.buy-sell-offers 4
 *
 * This component shows the details of an offer.
 *
 * @signature `<offer-details />`
 *
 * @link ../src/components/page-offers/offer-details/offer-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-details/offer-details.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './offer-details.less';
import view from './offer-details.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-details component'
  }
});

export default Component.extend({
  tag: 'offer-details',
  ViewModel,
  view
});
