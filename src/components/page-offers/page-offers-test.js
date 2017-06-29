import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './page-offers'

describe('wallet-ui/components/page-offers', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the page-offers component')
  })
})
