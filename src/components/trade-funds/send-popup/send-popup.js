/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup send-popup
 * @parent components.common
 *
 * A short description of the send-popup component
 *
 * @signature `<send-popup />`
 *
 * @link ../src/wallet-ui/components/trade-funds/send-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/send-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-popup.less';
import view from './send-popup.stache';
import Issuance from '~/models/issuance';

export const ViewModel = DefineMap.extend({
  formData: {
    value: new DefineMap({
      /**
       * @property {String} type
       * ENUM ('SECURITIES', 'FUNDS')
       */
      type: '',
      /**
       * @property {String} fundsType
       * ENUM ('EQB', 'BTC')
       */
      fundsType: 'EQB',

      toAddress: '1QJqB6mwTCELUStpay1zNQEo6mXLFhf7Qs',
      amount: 4,
      price: 100 * 1000,
      issuance: new Issuance({
        companyName: 'Alibaba Group',
        issuanceName: 'Series A'
      }),
      transactionFee: 0.0023,
      transactionFeePrice: 1.4,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.'
    })
  },
  mode: {
    value: 'edit'
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
