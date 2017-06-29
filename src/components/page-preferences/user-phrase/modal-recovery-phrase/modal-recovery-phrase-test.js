import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './modal-recovery-phrase'

describe('wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the modal-recovery-phrase component')
  })
})
