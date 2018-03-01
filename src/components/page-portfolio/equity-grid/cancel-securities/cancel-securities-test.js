import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './cancel-securities'

describe('wallet-ui/components/page-portfolio/equity-grid/cancel-securities', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the cancel-securities component')
  })
})
