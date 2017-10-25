import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './remove-issuance-passport'

describe('wallet-ui/components/page-trading-passports/remove-issuance-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the remove-issuance-passport component')
  })
})
