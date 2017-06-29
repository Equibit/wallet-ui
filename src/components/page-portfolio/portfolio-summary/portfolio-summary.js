/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-summary portfolio-summary
 * @parent components.portfolio
 *
 * A short description of the portfolio-summary component
 *
 * @signature `<portfolio-summary />`
 *
 * @link ../src/components/page-portfolio/portfolio-summary/portfolio-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/portfolio-summary/portfolio-summary.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './portfolio-summary.less'
import view from './portfolio-summary.stache'
// import PortfolioSummary from '~/models/portfolio';

export const ViewModel = DefineMap.extend({
  balance: {
    type: '*'
  },
  get dataPromise () {
    // return PortfolioSummary.get({});
  },
  summary: {
    get (val, resolve) {
      // this.dataPromise.then(resolve);
      return {
        balance: 54.234,
        totalCash: 34.123,
        totalSecurities: 20.111
      }
    }
  }
})

export default Component.extend({
  tag: 'portfolio-summary',
  ViewModel,
  view
})
