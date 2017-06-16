/**
 * @module {can.Component} components/page-auth/recovery-phrase/modal-recovery-phrase-prompt modal-recovery-phrase-prompt
 * @parent components.auth
 *
 * Prompts the user to enter the backup recovery phrase after loging in.
 *
 * @signature `<modal-recovery-phrase-prompt />`
 *
 * @link ../src/components/page-auth/recovery-phrase/modal-recovery-phrase-prompt/modal-recovery-phrase-prompt.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/modal-recovery-phrase-prompt/modal-recovery-phrase-prompt.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './modal-recovery-phrase-prompt.less';
import view from './modal-recovery-phrase-prompt.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the modal-recovery-phrase-prompt component'
  }
});

export default Component.extend({
  tag: 'modal-recovery-phrase-prompt',
  ViewModel,
  view
});
