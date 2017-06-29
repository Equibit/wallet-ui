import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './cancel-deal'

describe('wallet-ui/components/page-orders/cancel-deal', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the cancel-deal component')
  })
})
