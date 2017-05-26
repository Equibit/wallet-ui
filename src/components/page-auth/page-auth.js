import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-auth.stache';

export const ViewModel = DefineMap.extend({
  email: 'string',
  session: {
    type: 'any'
  }
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  view
});
