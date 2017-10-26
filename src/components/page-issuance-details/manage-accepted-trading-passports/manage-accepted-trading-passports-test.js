import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './manage-accepted-trading-passports'

describe('wallet-ui/components/page-issuance-details/manage-accepted-trading-passports', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the manage-accepted-trading-passports component')
  })
})