import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './remove-passport-warning'

describe('wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/remove-passport-warning', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the remove-passport-warning component')
  })
})
