import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './panel.less';
import view from './panel.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the drag-panel component'
  }
});

export default Component.extend({
  tag: 'drag-panel',
  ViewModel,
  view
});
