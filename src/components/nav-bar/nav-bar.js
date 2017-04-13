/**
 *
 * @module {can.Component} components/nav-bar Global Nav
 * @parent components.common
 *
 * @link ../src/components/nav-bar/nav-bar.html Full Page Demo
 * ## Example
 *
 * @demo src/components/nav-bar/nav-bar.html
 *
**/

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './nav-bar.less';
import view from './nav-bar.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the nav-bar component'
  }
});

export default Component.extend({
  tag: 'nav-bar',
  ViewModel,
  view
});
