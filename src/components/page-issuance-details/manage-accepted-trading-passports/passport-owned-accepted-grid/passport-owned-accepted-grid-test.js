import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './passport-owned-accepted-grid'

describe('wallet-ui/components/page-issuance-details/manage-accepted-trading-passports/passport-owned-accepted-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the passport-owned-accepted-grid component')
  })
})
