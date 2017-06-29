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
import DefineList from 'can-define/list/';
import './transactions-grid.less';
import view from './transactions-grid.stache';
import Transaction from '../../../models/transaction';
import Pagination from '~/models/pagination';

// import '../../../models/fixtures/transactions';

export const ViewModel = DefineMap.extend({
  pagination: {
    value: new Pagination({
      skip: 0,
      limit: 50
    })
  },
  addresses: {
    type: '*',
    get (val) {
      if (!val || !(val.BTC || val.EQB)) {
        return new DefineList([]);
      }
      return (val.BTC || new DefineList([])).concat(val.EQB);
    }
  },
  queryParams: {
    get () {
      return Object.assign({},
        this.pagination.params,
        {address: {'$in': this.addresses.get()}}
      );
    }
  },
  rows: {
    set (value) {
      if (value && value[0]) {
        setTimeout(() => {
          this.selectRowDefault(value[0]);
        }, 0);
      }
      return value;
    },
    get (value, resolve) {
      if (value) {
        return value;
      }
      Transaction.getList(this.queryParams).then(rows => {
        if (rows.total) {
          this.pagination.total = rows.total;
        }
        resolve(rows);
        this.selectRowDefault(rows[0]);
      });
    }
  },
  selectedRow: {
    type: '*'
  },
  selectRowDefault (row) {
    row.selected = true;
    this.selectedRow = row;
  },
  loadPage: function () {
    Transaction.getList(this.pagination.params).then(items => {
      this.rows = items;
    });
  }
});

export default Component.extend({
  tag: 'transactions-grid',
  ViewModel,
  view
});
