import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-issuance-details.less';
import view from './page-issuance-details.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-issuance-details component'
  }
});

export default Component.extend({
  tag: 'page-issuance-details',
  ViewModel,
  view
});
