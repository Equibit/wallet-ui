import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-settings.less';
import view from './page-settings.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-settings component'
  }
});

export default Component.extend({
  tag: 'page-settings',
  ViewModel,
  view
});
