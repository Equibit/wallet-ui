import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './message-details'

describe('wallet-ui/components/page-inbox/message-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the message-details component')
  })
})
