/**
 * @module {can.Component} wallet-ui/components/page-preferences/user-email user-email
 * @parent components.common
 *
 * A short description of the user-email component
 *
 * @signature `<user-email />`
 *
 * @link ../src/wallet-ui/components/page-preferences/user-email/user-email.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/user-email/user-email.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './user-email.less';
import view from './user-email.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the user-email component'
  }
});

export default Component.extend({
  tag: 'user-email',
  ViewModel,
  view
});
