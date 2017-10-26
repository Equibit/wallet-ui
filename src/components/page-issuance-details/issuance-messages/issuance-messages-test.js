import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './issuance-messages'

describe('wallet-ui/components/page-issuance-details/issuance-messages', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the issuance-messages component')
  })
})
