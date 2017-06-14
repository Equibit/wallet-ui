/**
 * @module {can.Component} components/page-preferences/user-autologout user-autologout
 * @parent components.user-preferences
 *
 * A short description of the user-autologout component
 *
 * @signature `<user-autologout />`
 *
 * @link ../src/components/page-preferences/user-autologout/user-autologout.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-autologout/user-autologout.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './user-autologout.less';
import view from './user-autologout.stache';

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false;
    this.isModalShown = true;
  }
});

export default Component.extend({
  tag: 'user-autologout',
  ViewModel,
  view
});
