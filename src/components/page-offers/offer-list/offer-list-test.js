import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './offer-list'

describe('wallet-ui/components/page-offers/offer-list', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the offer-list component')
  })
})
