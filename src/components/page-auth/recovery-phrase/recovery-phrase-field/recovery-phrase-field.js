/**
 * @module {can.Component} components/page-auth/recovery-phrase/recovery-phrase-field recovery-phrase-field
 * @parent components.auth
 *
 * Shows the field and valitation for entering the backup recovery phrase
 *
 * @signature `<recovery-phrase-field />`
 *
 * @link ../src/components/page-auth/recovery-phrase/recovery-phrase-field/recovery-phrase-field.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/recovery-phrase-field/recovery-phrase-field.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './recovery-phrase-field.less';
import view from './recovery-phrase-field.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the recovery-phrase-field component'
  }
});

export default Component.extend({
  tag: 'recovery-phrase-field',
  ViewModel,
  view
});
