import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './issuance-add-passport'

describe('wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/issuance-add-passport', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the issuance-add-passport component')
  })
})
