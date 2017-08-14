import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './issuance-confirm'

describe('wallet-ui/components/page-my-issuances/create-issuance/issuance-confirm', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the issuance-confirm component')
  })
})
