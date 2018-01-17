import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './order-offers-data'
import portfolio from '../../../models/mock/mock-portfolio'
import mockHtlcOffer from '../../../models/mock/mock-htlc-offer'
// import '../../../models/fixtures/issuances'

describe('wallet-ui/components/page-orders/order-offers-data', function () {
  let vm, offer, order
  beforeEach(function () {
    const htlcOfferMock = mockHtlcOffer()
    offer = htlcOfferMock.offer
    order = htlcOfferMock.order
    vm = new ViewModel({
      order
    })
  })
  describe('acceptOffer', function () {
    let openAcceptOfferModal, calledCorrectly
    before(function () {
      openAcceptOfferModal = ViewModel.prototype.openAcceptOfferModal
      ViewModel.prototype.openAcceptOfferModal = function (offer, tx, issuance) {
        if (offer && issuance && tx && tx.htlcStep === 2) {
          calledCorrectly = true
        }
      }
    })
    after(function () {
      ViewModel.prototype.openAcceptOfferModal = openAcceptOfferModal
    })
    it('should call `openAcceptOfferModal` with correct params', function (done) {
      vm.acceptOffer(offer).then(function () {
        assert.ok(calledCorrectly)
        done()
      })
    })
  })
  describe.skip('openAcceptOfferModal', function () {
    it('should ', function () {
      assert.ok()
    })
  })
  describe.skip('placeOffer', function () {
    it('should ', function () {
      assert.ok()
    })
  })
})
