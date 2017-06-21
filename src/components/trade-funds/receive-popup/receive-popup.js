/**
 * @module {can.Component} wallet-ui/components/trade-funds/receive-popup receive-popup
 * @parent components.portfolio
 *
 * A short description of the receive-popup component
 *
 * @signature `<receive-popup />`
 *
 * @link ../src/components/trade-funds/receive-popup/receive-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/receive-popup/receive-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './receive-popup.less';
import view from './receive-popup.stache';
import hub from '~/utils/event-hub';
import copy from 'copy-to-clipboard';
import { translate } from '~/i18n/i18n';

export const ViewModel = DefineMap.extend({
  /**
   * Object with two portfolio adresses: BTC and EQB.
   */
  address: {
    type: '*'
  },
  copy (type) {
    copy(this.address[type]);
    hub.dispatch({
      'type': 'alert',
      'kind': 'success',
      'title': translate('copiedToClipboard'),
      'displayInterval': 5000
    });
  },
  done (close) {
    this.dispatch('done');
    close();
  }
});

export default Component.extend({
  tag: 'receive-popup',
  ViewModel,
  view
});
