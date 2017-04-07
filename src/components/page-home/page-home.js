import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-home.less';
import view from './page-home.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'Welcome to Equibit!'
  }
});

export default Component.extend({
  tag: 'page-home',
  ViewModel,
  view
});
