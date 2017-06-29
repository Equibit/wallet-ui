import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './loading-indicator'

describe('wallet-ui/components/common/loading-indicator', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the loading-indicator component')
  })
})
