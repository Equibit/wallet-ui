import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './trade-row'

describe('wallet-ui/components/page-transactions/transactions-grid/trade-row', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the trade-row component')
  })
})
