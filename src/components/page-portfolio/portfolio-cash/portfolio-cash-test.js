import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './portfolio-cash'

describe('wallet-ui/components/page-portfolio/portfolio-cash', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the portfolio-cash component')
  })
})
