/**
 * @module {can.Component} wallet-ui/components/page-preferences/user-autologout user-logout
 * @parent components.common
 *
 * A short description of the user-logout component
 *
 * @signature `<user-logout />`
 *
 * @link ../src/wallet-ui/components/page-preferences/user-autologout/user-logout.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/user-autologout/user-logout.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './user-autologout.less';
import view from './user-autologout.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the user-logout component'
  }
});

export default Component.extend({
  tag: 'user-logout',
  ViewModel,
  view
});
