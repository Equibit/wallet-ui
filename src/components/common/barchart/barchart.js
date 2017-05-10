/**
 * @module {can.Component} wallet-ui/components/common/barchart bar-chart
 * @parent components.common
 *
 * A short description of the bar-chart component
 *
 * @signature `<bar-chart />`
 *
 * @link ../src/wallet-ui/components/common/barchart.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/common/barchart.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './barchart.less';
import view from './barchart.stache';

export const ViewModel = DefineMap.extend({
  dataColumns: {
    type: '*'
  },
  type: {
    type: 'string'
  }
});

export default Component.extend({
  tag: 'bar-chart',
  ViewModel,
  view
});
