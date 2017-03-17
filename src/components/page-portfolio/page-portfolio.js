import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-portfolio.scss';
import view from './page-portfolio.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-portfolio component'
  }
});

export default Component.extend({
  tag: 'page-portfolio',
  ViewModel,
  view
});
