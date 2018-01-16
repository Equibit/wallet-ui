import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './timer-notice'

describe('wallet-ui/components/trade-funds/timer-notice', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the timer-notice component')
  })
})
