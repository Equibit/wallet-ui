import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './bootstrap-slider'

describe('wallet-ui/components/common/bootstrap-slider', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the bootstrap-slider component')
  })
})
