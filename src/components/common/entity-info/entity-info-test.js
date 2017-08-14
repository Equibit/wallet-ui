import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './entity-info'

describe('wallet-ui/components/common/entity-info', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the entity-info component')
  })
})
