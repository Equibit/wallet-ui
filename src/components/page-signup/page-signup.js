import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-signup.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-signup component'
  }
});

export default Component.extend({
  tag: 'page-signup',
  ViewModel,
  view
});
