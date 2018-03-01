import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './cancel-authorized'

describe('wallet-ui/components/page-my-issuances/issuances-list/cancel-authorized', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the cancel-authorized component')
  })
})
