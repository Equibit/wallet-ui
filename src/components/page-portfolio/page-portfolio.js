import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-portfolio.less';
import view from './page-portfolio.stache';
import Portfolio from '~/models/portfolio';

export const ViewModel = DefineMap.extend({
  portfolios: {
    get (val, resolve) {
      return Portfolio.getList({}).then(resolve);
    }
  }
});

export default Component.extend({
  tag: 'page-portfolio',
  ViewModel,
  view
});
