import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './issuance-form'
import view from './issuance-form.stache'
import FormData from '../form-data'
import { companiesData } from '../../../../models/fixtures/companies'
import Company from '../../../../models/company'
import Issuance from '../../../../models/issuance'
import '../../../../models/mock/mock-session'
import issuance from '../../../../models/mock/mock-issuance'
import portfolio from '../../../../models/mock/mock-portfolio'

describe('wallet-ui/components/page-my-issuances/create-issuance/issuance-form', function () {
  const formData = new FormData({
    companies: new Company.List([companiesData[0]]),
    issuances: new Issuance.List([issuance]),
    portfolio
  })
  describe('bugfix: incorrect binding for can-select (should be no dashes)', function () {
    it('should be possible to select a company', function () {
      var vm = new ViewModel({
        formData
      })
      const frag = view(vm)
      vm.formData.issuance.selectedCompany = formData.companies[0]
      assert.ok(frag)
    })
  })
})
