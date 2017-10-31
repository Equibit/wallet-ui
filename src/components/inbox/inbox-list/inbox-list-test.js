import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './inbox-list'

describe('wallet-ui/components/inbox/inbox-list', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the inbox-list component')
  })
})
