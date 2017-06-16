/**
 * @module {can.Component} components/page-auth/recovery-phrase/confirm-funds-modal confirm-funds-modal
 * @parent components.auth
 *
 * Shows a promtp to the user to confirm his balance is equal to 0.
 *
 * @signature `<confirm-funds-modal />`
 *
 * @link ../src/components/page-auth/recovery-phrase/confirm-funds-modal/confirm-funds-modal.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/confirm-funds-modal/confirm-funds-modal.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './confirm-funds-modal.less';
import view from './confirm-funds-modal.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the confirm-funds-modal component'
  }
});

export default Component.extend({
  tag: 'confirm-funds-modal',
  ViewModel,
  view
});
