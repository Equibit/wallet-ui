import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './shareholders-modal'

describe('wallet-ui/components/page-issuance-details/shareholders-modal', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the shareholders-modal component')
  })
})
