import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './delete-draft-message-warning'

describe('wallet-ui/components/page-issuance-details/issuance-messages/delete-draft-message-warning', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the delete-draft-message-warning component')
  })
})
