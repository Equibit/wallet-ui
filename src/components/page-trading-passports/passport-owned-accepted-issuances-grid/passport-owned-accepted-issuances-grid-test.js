import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './passport-owned-accepted-issuances-grid'

describe('wallet-ui/components/page-trading-passports/passport-owned-accepted-issuances-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the passport-owned-accepted-issuances-grid component');
  })
})
