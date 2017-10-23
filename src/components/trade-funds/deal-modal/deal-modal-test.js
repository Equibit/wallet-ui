import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './deal-modal'

describe('wallet-ui/components/trade-funds/deal-modal', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the deal-modal component')
  })
})
