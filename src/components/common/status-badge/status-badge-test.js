import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './status-badge'

describe('wallet-ui/components/common/status-badge', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the status-badge component')
  })
})
