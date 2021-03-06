import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './grid-issuances.less'
import view from './grid-issuances.stache'
import Pagination from '~/models/pagination'
import Issuance from '~/models/issuance'

export const ViewModel = DefineMap.extend({
  pagination: {
    value: new Pagination({
      skip: 0,
      limit: 50
    })
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
      Issuance.getList(this.queryParams).then(rows => {
        if (rows.total || rows.count) {
          this.pagination.total = rows.total || rows.count
        }
        resolve(rows)
        if (rows && rows[0]) {
          this.selectRowDefault(rows[0])
        }
      })
    }
  },
  selectedRow: {
    type: '*'
  },
  sort: {
    type: '*'
  },
  queryParams: {
    get () {
      let params = this.pagination.params
      if (typeof this.sort !== 'undefined') {
        params['$sort'] = {
          change: this.sort
        }
      }
      return params
    }
  },
  loadPage: function () {
    Issuance.getList(this.queryParams).then(items => {
      this.rows = items
    })
  },
  noop (ev) {
    ev.stopPropagation()
  },
  changeSort () {
    this.sort = typeof this.sort === 'undefined' ? -1 : this.sort * (-1)
    this.loadPage()
  },
  selectRowDefault (row) {
    row.selected = true
    this.selectedRow = row
  }
})

export default Component.extend({
  tag: 'grid-issuances',
  ViewModel,
  view,
  events: {
    removed () {
      if (this.viewModel.selectedRow) {
        this.viewModel.selectedRow.selected = false
      }
    }
  }
})
