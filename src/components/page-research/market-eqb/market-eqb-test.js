import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './market-eqb'

describe('wallet-ui/components/page-research/market-eqb', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the market-eqb component')
  })
})
