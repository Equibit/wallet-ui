import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './poll-details'

describe('wallet-ui/components/page-inbox/poll-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the poll-details component')
  })
})
