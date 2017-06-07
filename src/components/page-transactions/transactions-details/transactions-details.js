/**
 * @module {can.Component} components/page-transactions/transactions-details transactions-details
 * @parent components.transactions
 *
 * This component shows the details of a transaction when selecting it from the `<transactions-grid>`.
 *
 * @signature `<transaction-details />`
 *
 * @link ../src/components/page-transactions/transactions-details/transaction-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-transactions/transactions-details/transactions-details.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './transactions-details.less';
import view from './transactions-details.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the transactions-details component'
  }
});

export default Component.extend({
  tag: 'transactions-details',
  ViewModel,
  view
});
