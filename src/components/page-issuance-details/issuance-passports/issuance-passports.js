import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './issuance-passports.less';
import view from './issuance-passports.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-passports component'
  }
});

export default Component.extend({
  tag: 'issuance-passports',
  ViewModel,
  view
});
