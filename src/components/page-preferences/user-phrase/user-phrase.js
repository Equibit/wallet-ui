/**
 * @module {can.Component} components/page-preferences/user-phrase user-phrase
 * @parent components.user-preferences
 *
 * A short description of the user-phrase component
 *
 * @signature `<user-phrase />`
 *
 * @link ../src/components/page-preferences/user-phrase/user-phrase.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/scomponents/page-preferences/user-phrase/user-phrase.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './user-phrase.less';
import view from './user-phrase.stache';

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false;
    this.isModalShown = true;
  }
});

export default Component.extend({
  tag: 'user-phrase',
  ViewModel,
  view
});
