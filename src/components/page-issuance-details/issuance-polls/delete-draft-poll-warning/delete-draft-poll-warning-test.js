import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './delete-draft-poll-warning'

describe('wallet-ui/components/page-issuance-details/issuance-polls/delete-draft-poll-warning', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the delete-draft-poll-warning component')
  })
})
