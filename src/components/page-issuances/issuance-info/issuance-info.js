import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './issuance-info.less';
import view from './issuance-info.stache';

export const ViewModel = DefineMap.extend({
  issuance: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'issuance-info',
  ViewModel,
  view
});
