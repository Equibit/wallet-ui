import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './create-passport'

describe('wallet-ui/components/page-trading-passports/create-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the create-passport component')
  })
})
