import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './issuance-buy-orders.less';
import view from './issuance-buy-orders.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-buy-orders component'
  }
});

export default Component.extend({
  tag: 'issuance-buy-orders',
  ViewModel,
  view
});
