import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './market-summary'

describe('wallet-ui/components/page-research/market-summary', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the market-summary component')
  })
})
