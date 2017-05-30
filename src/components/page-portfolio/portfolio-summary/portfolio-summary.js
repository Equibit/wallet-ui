/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-summary portfolio-summary
 * @parent components.portfolio
 *
 * A short description of the portfolio-summary component
 *
 * @signature `<portfolio-summary />`
 *
 * @link ../src/components/page-portfolio/portfolio-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/portfolio-summary.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './portfolio-summary.less';
import view from './portfolio-summary.stache';
import PortfolioSummary from '~/models/portfolio-summary';

export const ViewModel = DefineMap.extend({
  get dataPromise () {
    return PortfolioSummary.get({});
  },
  summary: {
    get (val, resolve) {
      this.dataPromise.then(resolve);
    }
  }
});

export default Component.extend({
  tag: 'portfolio-summary',
  ViewModel,
  view
});
