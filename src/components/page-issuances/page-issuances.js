import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import './page-issuances.less';
import view from './page-issuances.stache';

export const ViewModel = DefineMap.extend({
  rows: {
    value: new DefineList([])
  }
});

export default Component.extend({
  tag: 'page-issuances',
  ViewModel,
  view
});
