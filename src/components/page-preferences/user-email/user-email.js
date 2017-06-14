/**
 * @module {can.Component} components/page-preferences/user-email user-email
 * @parent components.user-preferences
 *
 * A short description of the user-email component
 *
 * @signature `<user-email />`
 *
 * @link ../src/components/page-preferences/user-email/user-email.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-email/user-email.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './user-email.less';
import view from './user-email.stache';

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false;
    this.isModalShown = true;
  }
});

export default Component.extend({
  tag: 'user-email',
  ViewModel,
  view
});
