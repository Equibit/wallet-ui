import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './bootstrap-datepicker'

describe('wallet-ui/components/common/bootstrap-datepicker', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the bootstrap-datepicker component')
  })
})
