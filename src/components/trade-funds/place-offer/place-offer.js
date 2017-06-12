/**
 * @module {can.Component} components/trade-funds/place-offer place-offer
 * @parent components.buy-sell-offers 0
 *
 * This component shows the modal with the forms for placing a buy or sell offers.
 *
 * @signature `<place-offer />`
 *
 * @link ../src/components/trade-funds/place-offer/place-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-offer/place-offer.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './place-offer.less';
import view from './place-offer.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the place-offer component'
  }
});

export default Component.extend({
  tag: 'place-offer',
  ViewModel,
  view
});
