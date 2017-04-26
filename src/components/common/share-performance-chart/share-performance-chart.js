import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './share-performance-chart.less';
import view from './share-performance-chart.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the share-performance-chart component'
  }
});

export default Component.extend({
  tag: 'share-performance-chart',
  ViewModel,
  view
});
