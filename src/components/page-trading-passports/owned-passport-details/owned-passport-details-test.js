import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './owned-passport-details'

describe('wallet-ui/components/page-trading-passports/owned-passport-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the owned-passport-details component')
  })
})
