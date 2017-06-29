import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './flow-message'

describe('wallet-ui/components/common/flow-message', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the flow-message component')
  })
})
