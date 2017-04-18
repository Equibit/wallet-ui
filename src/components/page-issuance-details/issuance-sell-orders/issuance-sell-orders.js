import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './issuance-sell-orders.less';
import view from './issuance-sell-orders.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-sell-orders component'
  }
});

export default Component.extend({
  tag: 'issuance-sell-orders',
  ViewModel,
  view
});
