import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './receive-popup'

describe('wallet-ui/components/trade-funds/receive-popup', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the receive-popup component')
  })
})
