import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './compose-message'

describe('wallet-ui/components/page-issuance-details/issuance-messages/compose-message', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the compose-message component')
  })
})
