import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './phrase-input'

describe('wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-input', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the phrase-input component')
  })
})
