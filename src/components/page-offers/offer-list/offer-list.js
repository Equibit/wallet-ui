/**
 * @module {can.Component} components/page-offers/offer-list offer-list
 * @parent components.buy-sell-offers 3
 *
 * This components shows a list of offers.
 *
 * @signature `<offer-list />`
 *
 * @link ../src/components/page-offers/offer-list/offer-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-list/offer-list.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './offer-list.less';
import view from './offer-list.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-list component'
  }
});

export default Component.extend({
  tag: 'offer-list',
  ViewModel,
  view
});
