import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-portfolio.less';
import view from './page-portfolio.stache';
import Portfolio from '~/models/portfolio';

export const ViewModel = DefineMap.extend({
  portfoliosPromise: {
    get () {
      return Portfolio.getList({$limit: 5, $skip: 0});
    }
  },
  portfolios: {
    get (val, resolve) {
      if (val) {
        return val;
      }
      this.portfoliosPromise.then(resolve);
    }
  }
});

export default Component.extend({
  tag: 'page-portfolio',
  ViewModel,
  view
});
