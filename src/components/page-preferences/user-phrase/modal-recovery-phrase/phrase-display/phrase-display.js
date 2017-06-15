/**
 * @module {can.Component} wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display phrase-display
 * @parent components.components.user-preferences
 *
 * Shows the recovery phrase
 *
 * @signature `<phrase-display />`
 *
 * @link ../src/wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display/phrase-display.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display/phrase-display.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './phrase-display.less';
import view from './phrase-display.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the phrase-display component'
  }
});

export default Component.extend({
  tag: 'phrase-display',
  ViewModel,
  view
});
