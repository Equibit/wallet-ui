import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './offer-details'

describe('wallet-ui/components/page-offers/offer-details', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the offer-details component')
  })
})
