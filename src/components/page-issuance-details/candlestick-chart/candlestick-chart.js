/**
 * @module {can.Component} components/page-issuance-details/candlestick-chart candlestick-chart
 * @parent components.issuance-details
 *
 * Issuance Details / Market Depth
 *
 * @signature `candlestick-chart>`
 *
 * @link ../src/components/page-issuance-details/candlestick-chart/candlestick-chart.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/candlestick-chart/candlestick-chart.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './candlestick-chart.less';
import view from './candlestick-chart.stache';
import Candlestick from '~/models/candlestick';

export const ViewModel = DefineMap.extend({
  chartData: {
    type: '*'
  },
  chartHeight: {
    value: 350
  },
  candlestickSize: {
    value: 7200,
    set (val) {
      setTimeout(() => {
        this.loadData(val);
      }, 0);
      return val;
    }
  },
  loadData (candlestickSize) {
    console.log(`loadData(${candlestickSize})`);
    Candlestick.getList().then(chartData => {
      console.log(`loadedData(${chartData.length})`);
      this.chartData = chartData;
    });
  }
});

export default Component.extend({
  tag: 'candlestick-chart',
  ViewModel,
  view
});
