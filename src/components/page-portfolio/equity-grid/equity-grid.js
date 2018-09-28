/**
 * @module {can.Component} wallet-ui/components/page-portfolio/equity-grid equity-grid
 * @parent components.portfolio
 *
 * A short description of the equity-grid component
 *
 * @signature `<equity-grid />`
 *
 * @link ../src/components/page-portfolio/equity-grid/equity-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/equity-grid/equity-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './equity-grid.less'
import view from './equity-grid.stache'
import Pagination from '~/models/pagination'

// TODO: turn fixtures off
import '~/models/fixtures/securities'

export const ViewModel = DefineMap.extend({
  pagination: {
    value: new Pagination({
      skip: 0,
      limit: 10
    })
  },
  rows: '*',
  queryParams: {
    get () {
      let params = this.pagination.params
      return Object.assign({securityType: 'equity'}, params)
    }
  },
  cancelFn: '*',
  cancelModalShowing: {
    value: false
  },
  cancelIssuance: '*',
  showCancelModal (issuance) {
    this.cancelModalShowing = false
    this.cancelIssuance = issuance
    this.cancelModalShowing = true
  }
})

export default Component.extend({
  tag: 'equity-grid',
  ViewModel,
  view
})
