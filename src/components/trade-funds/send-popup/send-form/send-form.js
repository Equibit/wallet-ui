/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup/send-form send-form
 * @parent components.portfolio
 *
 * The 1st form for the Send Popup component
 *
 * @signature `<send-form />`
 *
 * @link ../src/components/trade-funds/send-popup/send-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/send-popup/send-form.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-form.less';
import view from './send-form.stache';
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
  tag: 'send-form',
  ViewModel,
  view
});
