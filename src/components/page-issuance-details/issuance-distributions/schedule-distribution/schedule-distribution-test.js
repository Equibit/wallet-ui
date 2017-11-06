import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './schedule-distribution'

describe('wallet-ui/components/page-issuance-details/issuance-distributions/schedule-distribution', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the schedule-distribution component')
  })
})
