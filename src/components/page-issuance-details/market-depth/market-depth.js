/**
 * @module {can.Component} components/market-depth market-depth
 * @parent components.common
 *
 * Issuance Details / Market Depth
 *
 * @signature `<market-depth />`
 *
 * @link ../src/components/page-issuance-details/market-depth/market-depth.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/market-depth/market-depth.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './market-depth.less';
import view from './market-depth.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the market-depth component'
  }
});

export default Component.extend({
  tag: 'market-depth',
  ViewModel,
  view
});
