/**
 * @module {can.Component} wallet-ui/components/page-research/market-summary market-summary
 * @parent components.common
 *
 * A short description of the market-summary component
 *
 * @signature `<market-summary />`
 *
 * @link ../src/wallet-ui/components/page-research/market-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-research/market-summary.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './market-summary.less';
import view from './market-summary.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the market-summary component'
  }
});

export default Component.extend({
  tag: 'market-summary',
  ViewModel,
  view
});
