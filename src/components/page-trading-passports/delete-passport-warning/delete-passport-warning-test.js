import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './delete-passport-warning'

describe('wallet-ui/components/page-trading-passports/delete-passport-warning', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the delete-passport-warning component')
  })
})
