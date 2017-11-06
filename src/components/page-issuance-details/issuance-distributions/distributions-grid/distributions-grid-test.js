import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './distributions-grid'

describe('wallet-ui/components/page-issuance-details/issuance-distributions/distributions-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the distributions-grid component')
  })
})
