import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './issuance-distributions'

describe('wallet-ui/components/page-issuance-details/issuance-distributions', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the issuance-distributions component')
  })
})
