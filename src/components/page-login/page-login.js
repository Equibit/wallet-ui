import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-login.scss';
import view from './page-login.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-login component'
  }
});

export default Component.extend({
  tag: 'page-login',
  ViewModel,
  view
});
