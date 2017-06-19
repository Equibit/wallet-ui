/**
 * @module {can.Component} components/page-transactions page-transactions
 * @parent components.pages
 *
 * A short description of the page-transactions component
 *
 * @signature `<page-transactions />`
 *
 * @link ../src/components/page-transactions/page-transactions.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-transactions/page-transactions.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-transactions.less';
import view from './page-transactions.stache';
import Transaction from '../../models/transaction';

import '../../models/fixtures/transactions';

export const ViewModel = DefineMap.extend({
  promise: {
    get () {
      return Transaction.getList({});
    }
  },
  transactions: {
    get (val, resolve) {
      if (!val) {
        this.promise.then(resolve);
      }
      return val;
    }
  }
});

export default Component.extend({
  tag: 'page-transactions',
  ViewModel,
  view
});
