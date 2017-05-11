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
  },
  config: {
    type: '*',
    value: {
      axis: {
        x: {
          type: 'category',
          tick: {
            rotate: -25,
            multiline: false
          },
          height: 30,
          padding: {
            left: 0.5
          }
        },
        y: {
          label: {
            text: 'Price (BTC)',
            position: 'inner-top'
          }
        }
      }
    }
  },
  axisX: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'bar-chart',
  ViewModel,
  view
});
