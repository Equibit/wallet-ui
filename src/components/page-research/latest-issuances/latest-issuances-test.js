import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './latest-issuances'

describe('wallet-ui/components/page-research/latest-issuances', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the latest-issuances component')
  })
})
