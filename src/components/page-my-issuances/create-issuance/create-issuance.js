/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/create-issuance create-issuance
 * @parent components.common
 *
 * A short description of the create-issuance component
 *
 * @signature `<create-issuance />`
 *
 * @link ../src/components/page-my-issuances/create-issuance/create-issuance.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/create-issuance/create-issuance.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-issuance.less'
import view from './create-issuance.stache'
import Issuance from '../../../models/issuance'
import Company from '../../../models/company'
import Session from '../../../models/session'

export const ViewModel = DefineMap.extend({
  mode: {
    type: 'string',
    value: 'edit'
  },
  issuance: {
    value: new Issuance({
      sharesAuthorized: 100 * 1000 * 1000
    })
  },
  selectedCompany: '*',

  newCompany: '*',
  companies: {
    get (val, resolve) {
      Company.getList({userId: Session.current.user._id}).then(resolve)
    }
  },
  next () {
    this.mode = 'confirm'
  },
  edit () {
    this.mode = 'edit'
  },
  create (close) {
    this.dispatch('create', [{}])
    close()
  },
  saveCompany () {
    this.newCompany.validateAndSave().then(() => {
      this.mode = 'edit'
      this.companies.push(this.newCompany)
      this.selectedCompany = this.newCompany
    })
  }
})

export default Component.extend({
  tag: 'create-issuance',
  ViewModel,
  view
})
