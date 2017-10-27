import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './sent-messages-grid'

describe('wallet-ui/components/page-issuance-details/issuance-messages/sent-messages-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the sent-messages-grid component')
  })
})
