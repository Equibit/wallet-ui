import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './add-issuance-owned-passport'

describe('wallet-ui/components/page-trading-passports/add-issuance-owned-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the add-issuance-owned-passport component');
  })
})
