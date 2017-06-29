import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './send-popup'

describe('wallet-ui/components/trade-funds/send-popup', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the send-popup component')
  })
})
