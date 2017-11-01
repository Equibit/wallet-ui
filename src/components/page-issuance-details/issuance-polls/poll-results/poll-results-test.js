import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './poll-results'

describe('wallet-ui/components/page-issuance-details/issuance-polls/poll-results', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the poll-results component')
  })
})
