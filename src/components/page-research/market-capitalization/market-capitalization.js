/**
 * @module {can.Component} wallet-ui/components/page-research/market-capitalization market-capitalization
 * @parent components.common
 *
 * A short description of the market-capitalization component
 *
 * @signature `<market-capitalization />`
 *
 * @link ../src/wallet-ui/components/page-research/market-capitalization.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-research/market-capitalization.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './market-capitalization.less';
import view from './market-capitalization.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the market-capitalization component'
  }
});

export default Component.extend({
  tag: 'market-capitalization',
  ViewModel,
  view
});
