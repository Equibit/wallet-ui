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

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/'
import route from 'can-route'
import './transactions-grid.less'
import view from './transactions-grid.stache'
import Transaction from '../../../models/transaction/transaction'
import Pagination from '../../../models/pagination'

// import '../../../models/fixtures/transactions';

export const ViewModel = DefineMap.extend({
  pagination: {
    value: function () {
      return new Pagination({
        skip: 0,
        limit: 50
      })
    }
  },
  addresses: {
    type: '*',
    get (val) {
      if (!val || !(val.BTC || val.EQB)) {
        return new DefineList([])
      }
      return (val.BTC || new DefineList([])).concat(val.EQB)
    }
  },
  queryParams: {
    get () {
      return Object.assign({},
        this.pagination.params,
        {
          $or:
          [{ fromAddress: { '$in': this.addresses.get() } },
            { toAddress: { '$in': this.addresses.get() } }],
          $sort: { createdAt: -1 }
        }
      )
    }
  },
  rows: {
    set (value) {
      if (value && value[0]) {
        setTimeout(() => {
          this.selectRowDefault(value[0])
        }, 0)
      }
      return value
    },
    get (value, resolve) {
      if (value) {
        return value
      }
      Transaction.getList(this.queryParams).then(rows => {
        if (rows.total) {
          this.pagination.total = rows.total
        }
        resolve(rows)
        if (rows && rows[0]) {
          this.selectRowDefault(rows[0])
        }
      })
    }
  },
  get rowsCollated () {
    if (this.rows) {
      const _rows = this.rows.slice(0)
      const buckets = {}
      _rows.forEach((row, index) => {
        if (row.offerId) {
          if (buckets[row.offerId]) {
            buckets[row.offerId].push(row)
            _rows[index] = null
          } else {
            buckets[row.offerId] = [row]
            _rows[index] = {
              isTradeGroup: true,
              rows: buckets[row.offerId]
            }
          }
        }
      })
      return _rows.filter(row => row)
    }
  },
  selectedRow: {
    type: '*'
  },
  isUserAddress (address) {
    return this.addresses.indexOf(address) > -1
  },
  selectRowDefault (row) {
    if (route.data.itemId) {
      const found = this.rows.filter(a => {
        return a._id === route.data.itemId || a.txId === route.data.itemId
      })
      if (found && found[0]) {
        row = found[0]
      }
    }
    if (this.selectedRow) {
      this.selectedRow.selected = false
    }
    row.selected = true
    this.selectedRow = row
  },
  loadPage: function () {
    Transaction.getList(this.pagination.params).then(items => {
      this.rows = items
    })
  }
})

export default Component.extend({
  tag: 'transactions-grid',
  ViewModel,
  view
})
