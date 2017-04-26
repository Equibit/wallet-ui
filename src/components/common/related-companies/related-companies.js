import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './related-companies.less';
import view from './related-companies.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the related-companites component'
  }
});

export default Component.extend({
  tag: 'related-companites',
  ViewModel,
  view
});
