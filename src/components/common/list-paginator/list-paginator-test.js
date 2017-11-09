import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './list-paginator'

describe('wallet-ui/src/components/common/list-paginator', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the list-paginator component')
  })
})
