import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './distribution-confirm'

describe('wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution/distribution-confirm', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the distribution-confirm component')
  })
})
