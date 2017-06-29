import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './send-form'

describe('wallet-ui/components/trade-funds/send-popup/send-form', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the send-form component')
  })
})
