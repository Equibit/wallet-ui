import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import './grid-issuances.less';
import view from './grid-issuances.stache';

export const ViewModel = DefineMap.extend({
  rows: {
    value: new DefineList([])
  },
  selectedRow: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'grid-issuances',
  ViewModel,
  view
});
