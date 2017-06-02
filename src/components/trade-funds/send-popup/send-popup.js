/**
 * @module {can.Component} components/trade-funds/send-popup send-popup
 * @parent components.portfolio
 *
 * A short description of the send-popup component
 *
 * @signature `<send-popup />`
 *
 * @link ../src/components/trade-funds/send-popup/send-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/send-popup/send-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-popup.less';
import view from './send-popup.stache';
import Issuance from '~/models/issuance';
import { toMaxPrecision } from '~/utils/formatter';

const FormData = DefineMap.extend({
  /**
   * @property {String} type
   * ENUM ('SECURITIES', 'FUNDS')
   */
  type: '',

  /**
   * @property {String} fundsType
   * ENUM ('EQB', 'BTC')
   */
  fundsType: {
    type: 'string',
    value: 'EQB',
    get (val) {
      if (this.type === 'SECURITIES') {
        return 'EQB';
      }
      return val;
    }
  },

  toAddress: 'string',
  amount: {
    type: 'number',
    set (val) {
      return toMaxPrecision(val, 8);
    }
  },
  price: 'number',
  issuance: Issuance,
  transactionFee: 'number',
  transactionFeePrice: 'number',
  description: 'string'
});

export const ViewModel = DefineMap.extend({
  formData: {
    value: new FormData({
      type: '',
      fundsType: 'EQB',
      toAddress: '1QJqB6mwTCELUStpay1zNQEo6mXLFhf7Qs',
      amount: 4,
      price: 100 * 1000,
      transactionFee: 0.0023,
      transactionFeePrice: 1.4,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.'
    })
  },
  mode: {
    value: 'edit'
  },
  issuances: {
    get (val, resolve) {
      if (!val) {
        Issuance.getList().then(resolve);
      }
      return val;
    }
  },
  next () {
    this.mode = 'confirm';
  },
  edit () {
    this.mode = 'edit';
  }
});

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
});
