/**
 * @module {can.Component} wallet-ui/components/page-portfolio/watch-list watch-list
 * @parent components.common
 *
 * A short description of the watch-list component
 *
 * @signature `<watch-list />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/watch-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/watch-list.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './watch-list.less';
import view from './watch-list.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the watch-list component'
  }
});

export default Component.extend({
  tag: 'watch-list',
  ViewModel,
  view
});
