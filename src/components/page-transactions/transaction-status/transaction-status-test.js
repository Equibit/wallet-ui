import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './transaction-status'

describe('wallet-ui/components/page-transactions/transaction-status', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the transaction-status component')
  })
})
