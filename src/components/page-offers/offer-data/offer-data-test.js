import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './offer-data'

describe('wallet-ui/components/page-offers/offer-data', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the offer-data component')
  })
})
