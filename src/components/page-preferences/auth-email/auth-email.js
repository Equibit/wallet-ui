/**
 * @module {can.Component} wallet-ui/components/page-preferences/auth-email auth-email
 * @parent components.common
 *
 * A short description of the auth-email component
 *
 * @signature `<auth-email />`
 *
 * @link ../src/wallet-ui/components/page-preferences/auth-email/auth-email.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/auth-email/auth-email.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './auth-email.less';
import view from './auth-email.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the auth-email component'
  }
});

export default Component.extend({
  tag: 'auth-email',
  ViewModel,
  view
});
