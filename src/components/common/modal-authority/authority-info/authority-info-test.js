import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './authority-info'

describe('wallet-ui/components/common/modal-authority/authority-info', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the authority-info component')
  })
})
