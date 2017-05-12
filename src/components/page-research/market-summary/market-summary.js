/**
 * @module {can.Component} wallet-ui/components/page-research/market-summary market-summary
 * @parent components.common
 *
 * A short description of the market-summary component
 *
 * @signature `<market-summary />`
 *
 * @link ../src/components/page-research/market-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-research/market-summary.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './market-summary.less';
import view from './market-summary.stache';
import Market from '~/models/market';

export const ViewModel = DefineMap.extend({
  marketPromise: {
    type: '*'
  },
  market: {
    get (val, resolve) {
      if (val) {
        return val;
      }
      this.marketPromise = Market.get().then(resolve);
    }
  }
});

export default Component.extend({
  tag: 'market-summary',
  ViewModel,
  view
});
