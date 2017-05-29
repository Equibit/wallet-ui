/**
 * @module {can.Component} wallet-ui/components/trade-funds/receive-popup receive-popup
 * @parent components.portfolio
 *
 * A short description of the receive-popup component
 *
 * @signature `<receive-popup />`
 *
 * @link ../src/wallet-ui/components/trade-funds/receive-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/receive-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './receive-popup.less';
import view from './receive-popup.stache';
import hub from '~/utils/event-hub';
import copy from 'copy-to-clipboard';
import { translate } from '~/i18n/i18n';

export const ViewModel = DefineMap.extend({
  address: {
    type: 'string',
    value: '1QJqB6mwTCELUStpay1zNQEo6mXLFhf7Qs'
  },
  copy () {
    copy(this.address);
    hub.dispatch({
      'type': 'alert',
      'kind': 'success',
      'title': translate('copiedToClipboard'),
      'displayInterval': 5000
    });
  }
});

export default Component.extend({
  tag: 'receive-popup',
  ViewModel,
  view
});
