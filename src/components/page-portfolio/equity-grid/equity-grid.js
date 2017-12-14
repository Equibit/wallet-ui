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
import Session from '../../../models/session'
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
  rowsFormatted: {
    get () {
      return this.rows && this.rows.map(({utxo, data}) => {
        return {
          issuanceName: data.issuance.issuance_name,
          issuanceType: data.issuance.security_type,
          // todo: tmp for demo.
          issuanceUnit: 'SHARES',
          amount: utxo.amount,
          quantity: utxo.amount,
          price: Math.floor(
            Session.current.rates.securitiesToBtc * (utxo.amount / 100000000)
          ),  // microBTC
          valueBtc: Session.current.rates.securitiesToBtc * utxo.amount,
          companyName: data.company.legal_name,
          companySlug: data.company.legal_name && data.company.legal_name.toLowerCase().split(' ').join('-'),
          utxo
        }
      })
    }
  },
  queryParams: {
    get () {
      let params = this.pagination.params
      return Object.assign({securityType: 'equity'}, params)
    }
  },
  cancel (issuance) {
    this.dispatch('cancel', [issuance])
  }
})

export default Component.extend({
  tag: 'equity-grid',
  ViewModel,
  view
})
