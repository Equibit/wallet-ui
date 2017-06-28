/**
 * @module {can.Component} components/page-auth/recovery-phrase/recovery-phrase recovery-phrase
 * @parent components.auth
 *
 * Prompts the user to enter the backup recovery phrase after loging in.
 *
 * @signature `<recovery-phrase />`
 *
 * @link ../src/components/page-auth/recovery-phrase/recovery-phrase.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/recovery-phrase.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './recovery-phrase.stache';
import route from 'can-route';
import hub from '~/utils/event-hub';
import i18n from '../../../i18n/i18n';

export const ViewModel = DefineMap.extend({
  user: {
    type: '*'
  },
  mnemonic: 'string',
  error: 'string',
  mode: {
    value: 'prompt',
    set (val) {
      if (['prompt', 'warning', 'confirm', 'try-again'].indexOf(val) === -1) {
        console.error('Error: wrong value for the mode: ' + val);
        val = 'prompt';
      }
      return val;
    }
  },
  switch (val) {
    this.mode = val;
  },
  recoverFunds (ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.mnemonic) {
      this.error = i18n.validationMnemonicEmpty;
      return;
    }
    this.user.generateWalletKeys(this.mnemonic);
  },
  confirmNoPhrase () {
    this.user.generateWalletKeys();
    this.routeWithAlert();
  },
  routeWithAlert (isNewUser = true) {
    route.data.page = 'portfolio';
    hub.dispatch({
      'type': 'alert',
      'kind': 'success',
      'title': isNewUser ? i18n.accountCreated : i18n.passwordReset,
      'displayInterval': 10000,
      'message': isNewUser ? '' : i18n.passwordResetMsg
    });
  }
});

export default Component.extend({
  tag: 'recovery-phrase',
  ViewModel,
  view
});
