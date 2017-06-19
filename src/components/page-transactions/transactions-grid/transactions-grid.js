/**
 * @module {can.Component} components/page-transactions/transactions-grid transactions-grid
 * @parent components.transactions
 *
 * This component displays the list of transactions in a table grid.
 *
 * @signature `<transactions-grid />`
 *
 * @link ../src/components/page-transactions/transactions-grid/transactions-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-transactions/transactions-grid/transactions-grid.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './transactions-grid.less';
import view from './transactions-grid.stache';

export const ViewModel = DefineMap.extend({
  transactions: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'transactions-grid',
  ViewModel,
  view
});
