import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-issuance-details.less';
import view from './page-issuance-details.stache';
// import $ from 'jquery';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-issuance-details component'
  },
  chartData: {
    type: '*'
  },
  chartHeight: {
    value: 250
  },
  candlestickSize: {
    set (val) {
      setTimeout(() => {
        this.loadData(val);
      }, 0);
      return val;
    }
  },
  loadData (candlestickSize) {
    console.log(`loadData(${candlestickSize})`);
    // $.get(candlestickSize < 1000 ? 'data-1.json' : 'data-2.json').then(chartData => {
    //   console.log(`loadedData(${chartData.length})`);
    //   this.chartData = chartData;
    // });
  }
});

export default Component.extend({
  tag: 'page-issuance-details',
  ViewModel,
  view
});
