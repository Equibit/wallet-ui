import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './panel.less';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the drag-panel component'
  }
});

export default Component.extend({
  tag: 'drag-panel',
  ViewModel,
});
