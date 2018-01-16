import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './confirm-summary'

describe('wallet-ui/components/trade-funds/confirm-summary', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the confirm-summary component')
  })
})
