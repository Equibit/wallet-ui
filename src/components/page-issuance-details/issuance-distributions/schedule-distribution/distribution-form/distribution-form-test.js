import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './distribution-form'

describe('wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-form', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the distribution-form component')
  })
})
