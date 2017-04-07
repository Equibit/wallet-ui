import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './nav-bar.less';
import view from './nav-bar.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the nav-bar component'
  }
});

export default Component.extend({
  tag: 'nav-bar',
  ViewModel,
  view
});
