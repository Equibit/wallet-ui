/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/create-issuance/issuance-form issuance-form
 * @parent components.common
 *
 * A short description of the issuance-form component
 *
 * @signature `<issuance-form />`
 *
 * @link ../src/wallet-ui/components/page-my-issuances/create-issuance/issuance-form/issuance-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/create-issuance/issuance-form/issuance-form.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-form.less'
import view from './issuance-form.stache'
import Issuance from '../../../../models/issuance'

export const ViewModel = DefineMap.extend({
  mode: '*',
  companies: '*',
  issuance: '*',
  selectedCompany: '*',
  issuanceTypes: {
    value: Issuance.types
  },
  sharesToEqb: {
    get () {
      return {
        rate: 1 / (100 * 1000 * 1000),
        symbol: 'EQB'
      }
    }
  },
  company () {
    this.mode = 'company'
  },
  hasEnoughFunds: '*',
  availableFunds: '*'
})

export default Component.extend({
  tag: 'issuance-form',
  ViewModel,
  view
})
