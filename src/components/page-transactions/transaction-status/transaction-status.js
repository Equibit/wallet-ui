/**
 * @module {can.Component} components/page-transactions/transaction-status transaction-status
 * @parent components.transactions
 *
 * This component shows the status of a transaction as part of the `<transaction-details>`
 *
 * @signature `<transaction-status />`
 *
 * @link ../src/components/page-transactions/transaction-status/transaction-status.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-transactions/transaction-status/transaction-status.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './transaction-status.less';
import view from './transaction-status.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the transaction-status component'
  }
});

export default Component.extend({
  tag: 'transaction-status',
  ViewModel,
  view
});
