/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup/send-edit-form send-edit-form
 * @parent components.common
 *
 * A short description of the send-edit-form component
 *
 * @signature `<send-edit-form />`
 *
 * @link ../src/wallet-ui/components/trade-funds/send-popup/send-edit-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/send-popup/send-edit-form.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-edit-form.less';
import view from './send-edit-form.stache';

export const ViewModel = DefineMap.extend({
  /**
   * @property {String} type
   * ENUM ('SECURITIES', 'FUNDS')
   */
  type: 'string',

  /**
   * @property {String} fundsType
   * ENUM ('EQB', 'BTC')
   */
  fundsType: {
    type: 'string',
    value: 'EQB'
  },

  setType (val, el) {
    this.formData.type = val;
    el.blur();
  },
  setFundsType (val, el) {
    this.formData.fundsType = val;
    el.blur();
  },
});

export default Component.extend({
  tag: 'send-edit-form',
  ViewModel,
  view
});
