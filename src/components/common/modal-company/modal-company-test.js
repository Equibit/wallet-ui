import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './modal-company'

describe('wallet-ui/components/common/modal-company', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the modal-company component')
  })
})
