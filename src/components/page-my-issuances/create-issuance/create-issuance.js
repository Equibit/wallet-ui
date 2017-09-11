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
import FormData from './form-data'

export const ViewModel = DefineMap.extend({
  mode: {
    type: 'string',
    value: 'edit'
  },
  portfolio: '*',
  formData: {
    get () {
      if (this.portfolio) {
        return new FormData({
          portfolio: this.portfolio
        })
      }
    }
  },
  newCompany: '*',

  // Methods:
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
      this.formData.companies.push(this.newCompany)
      this.formData.selectedCompany = this.newCompany
    })
  }
})

export default Component.extend({
  tag: 'create-issuance',
  ViewModel,
  view
})
