import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './sent-polls-grid'

describe('wallet-ui/components/page-issuance-details/issuance-polls/sent-polls-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the sent-polls-grid component')
  })
})
