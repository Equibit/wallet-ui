import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './sent-message-details'

describe('wallet-ui/components/page-issuance-details/issuance-messages/sent-message-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the sent-message-details component')
  })
})
