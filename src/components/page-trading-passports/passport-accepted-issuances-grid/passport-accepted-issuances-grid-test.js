import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './passport-accepted-issuances-grid'

describe('wallet-ui/components/page-trading-passports/passport-accepted-issuances-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the passport-accepted-issuances-grid component')
  })
})
