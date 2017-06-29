import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './recovery-phrase-forgot-password'

describe('wallet-ui/components/page-auth/recovery-phrase/recovery-phrase-forgot-password', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the recovery-phrase-forgot-password component')
  })
})
