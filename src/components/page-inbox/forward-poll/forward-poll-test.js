import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './forward-poll'

describe('wallet-ui/components/page-inbox/forward-poll', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the forward-poll component')
  })
})
