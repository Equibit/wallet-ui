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
import Company from '../../../models/company'
import Session from '../../../models/session'

const FormData = DefineMap.extend({
  company: {
    Type: Company
  },
  issuanceType: {
    type: '*'
  },
})

export const ViewModel = DefineMap.extend({
  mode: {
    type: 'string',
    value: 'edit'
  },
  formData: {
    Type: FormData,
    value: new FormData({})
  },

  companies: {
    get (val, resolve) {
      Company.getList({userId: Session.current.user._id}).then(resolve)
    }
  },
  newCompany: {
    type: '*'
  },
  selectedCompany: {
    type: '*'
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
      this.formData.company = this.newCompany
    })
  }
})

export default Component.extend({
  tag: 'create-issuance',
  ViewModel,
  view
})
