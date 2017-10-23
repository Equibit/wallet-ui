import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './received-passport-details'

describe('wallet-ui/components/page-trading-passports/received-passport-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the received-passport-details component')
  })
})
