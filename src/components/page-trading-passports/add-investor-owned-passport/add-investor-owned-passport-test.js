import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './add-investor-owned-passport'

describe('wallet-ui/components/page-trading-passports/add-investor-owned-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the add-investor-owned-passport component');
  })
})
