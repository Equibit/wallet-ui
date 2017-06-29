import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './barchart'

describe('wallet-ui/components/common/barchart', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the bar-chart component')
  })
})
