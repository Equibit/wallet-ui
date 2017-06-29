import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './watch-list'

describe('wallet-ui/components/page-portfolio/watch-list', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the watch-list component')
  })
})
