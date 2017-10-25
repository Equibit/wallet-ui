import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './revoke-investor-passport'

describe('wallet-ui/components/page-trading-passports/revoke-investor-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the revoke-investor-passport component')
  })
})
