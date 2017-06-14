/**
 * @module {can.Component} wallet-ui/components/page-preferences/user-phrase user-phrase
 * @parent components.common
 *
 * A short description of the user-phrase component
 *
 * @signature `<user-phrase />`
 *
 * @link ../src/wallet-ui/components/page-preferences/user-phrase/user-phrase.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/user-phrase/user-phrase.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './user-phrase.less';
import view from './user-phrase.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the user-phrase component'
  }
});

export default Component.extend({
  tag: 'user-phrase',
  ViewModel,
  view
});
