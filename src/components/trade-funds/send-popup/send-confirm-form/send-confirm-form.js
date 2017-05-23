/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup/send-confirm-form send-confirm-form
 * @parent components.common
 *
 * A short description of the send-confirm-form component
 *
 * @signature `<send-confirm-form />`
 *
 * @link ../src/wallet-ui/components/trade-funds/send-popup/send-confirm-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/send-popup/send-confirm-form.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-confirm-form.less';
import view from './send-confirm-form.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'send-confirm-form component'
  }
});

export default Component.extend({
  tag: 'send-confirm-form',
  ViewModel,
  view
});
