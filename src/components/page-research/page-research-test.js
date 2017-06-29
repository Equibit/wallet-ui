import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './page-research'

describe('wallet-ui/components/page-research', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the page-research component')
  })
})
