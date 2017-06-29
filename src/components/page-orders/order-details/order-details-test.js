import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './order-details'

describe('wallet-ui/components/page-orders/order-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the order-details component')
  })
})
