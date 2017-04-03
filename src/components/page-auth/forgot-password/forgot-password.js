import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './forgot-password.less';
import view from './forgot-password.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the forgot-password component'
  }
});

export default Component.extend({
  tag: 'forgot-password',
  ViewModel,
  view
});
