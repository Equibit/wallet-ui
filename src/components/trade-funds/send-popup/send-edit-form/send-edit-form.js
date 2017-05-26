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
import { Currency } from '~/components/trade-funds/currency-converter/';

export const ViewModel = DefineMap.extend({
  formData: {
    type: '*'
  },

  issuances: {
    type: '*'
  },

  sharesToUsd: {
    // TODO: the rate depends on the selected issuance!
    value: {
      rate: 110,
      symbol: 'USD'
    }
  },

  get fundsToUsd () {
    // TODO: the rate depends on the selected issuance!
    const val = this.formData.fundsType === 'EQB' ? { rate: 25, symbol: 'USD' } : { rate: 2800, symbol: 'USD' };
    return new Currency(val);
  },

  setType (val, el) {
    this.formData.type = val;
    el.blur();
  },

  setFundsType (val, el) {
    this.formData.fundsType = val;
    el.blur();
  },

  formatIssuance (issuance) {
    return `${issuance.companyName}, ${issuance.issuanceName}, ${issuance.marketCap} uBTC`;
  }
});

export default Component.extend({
  tag: 'send-edit-form',
  ViewModel,
  view
});
