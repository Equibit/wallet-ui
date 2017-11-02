import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './pie-chart'

describe('wallet-ui/components/common/pie-chart', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the pie-chart component')
  })
})
