import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './nav-footer'

describe('wallet-ui/components/nav-footer', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the nav-footer component')
  })
})
