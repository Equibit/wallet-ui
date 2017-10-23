import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './trading-passports-list'

describe('wallet-ui/components/page-trading-passports/trading-passports-list', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the trading-passports-list component');
  })
})
