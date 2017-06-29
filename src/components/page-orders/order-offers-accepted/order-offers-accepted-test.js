import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './order-offers-accepted'

describe('wallet-ui/components/page-orders/order-offers-accepted', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the order-offers-accepted component')
  })
})
