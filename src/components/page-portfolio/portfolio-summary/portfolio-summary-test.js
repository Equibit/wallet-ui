import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './portfolio-summary'

describe('wallet-ui/components/page-portfolio/portfolio-summary', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the portfolio-summary component')
  })
})
