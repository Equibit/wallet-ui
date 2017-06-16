/**
 * @module {can.Component} components/page-auth/recovery-phrase/recovery-phrase-modal recovery-phrase-modal
 * @parent components.auth
 *
 * Prompts the user to enter the backup recovery phrase after loging in.
 *
 * @signature `<recovery-phrase-modal />`
 *
 * @link ../src/components/page-auth/recovery-phrase/recovery-phrase-modal/recovery-phrase-modal.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/recovery-phrase-modal/recovery-phrase-modal.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './recovery-phrase-modal.less';
import view from './recovery-phrase-modal.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the recovery-phrase-modal component'
  }
});

export default Component.extend({
  tag: 'recovery-phrase-modal',
  ViewModel,
  view
});
