import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './accept-trading-passport'

describe('wallet-ui/components/page-issuance-details/accept-trading-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the accept-trading-passport component');
  })
})
