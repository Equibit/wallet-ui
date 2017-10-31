import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './sent-poll-details'

describe('wallet-ui/components/page-issuance-details/issuance-polls/sent-poll-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the sent-poll-details component')
  })
})
