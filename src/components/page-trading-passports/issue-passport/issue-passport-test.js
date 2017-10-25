import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './issue-passport'

describe('wallet-ui/components/page-trading-passports/issue-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the issue-passport component')
  })
})
