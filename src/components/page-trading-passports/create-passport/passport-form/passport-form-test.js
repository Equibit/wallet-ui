import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './passport-form'

describe('wallet-ui/components/page-trading-passports/create-passport/passport-form', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the passport-form component')
  })
})
