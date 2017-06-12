import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-portfolio.less';
import view from './page-portfolio.stache';
import Session from '~/models/session';
import Portfolio from '~/models/portfolio';

export const ViewModel = DefineMap.extend({
  portfolios: {
    get () {
      return Session.current.portfolios;
    }
  },
  balance: {
    get () {
      return Session.current.balance;
    }
  }
});

export default Component.extend({
  tag: 'page-portfolio',
  ViewModel,
  view
});
