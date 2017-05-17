/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-summary portfolio-summary
 * @parent components.common
 *
 * A short description of the portfolio-summary component
 *
 * @signature `<portfolio-summary />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/portfolio-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/portfolio-summary.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './portfolio-summary.less';
import view from './portfolio-summary.stache';
import Model from '~/models/portfolio-summary';

export const ViewModel = DefineMap.extend({
  get dataPromise () {
    return Model.get({});
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
