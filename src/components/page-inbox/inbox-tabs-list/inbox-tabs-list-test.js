import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './inbox-tabs-list'

describe('wallet-ui/components/page-inbox/inbox-tabs-list', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the inbox-tabs-list component')
  })
})
