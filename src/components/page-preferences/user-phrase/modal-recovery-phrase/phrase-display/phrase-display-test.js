import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './phrase-display'

describe('wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the phrase-display component')
  })
})
