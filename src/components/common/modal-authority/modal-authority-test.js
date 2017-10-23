import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './modal-authority'

describe('wallet-ui/components/common/modal-authority', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the modal-authority component')
  })
})
