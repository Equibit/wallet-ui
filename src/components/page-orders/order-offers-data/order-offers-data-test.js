import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './order-offers-data'
import Offer from '../../../models/offer'
import Transaction from '../../../models/transaction/transaction'
import Portfolio from '../../../models/portfolio'
import mockHtlcOffer from '../../../models/mock/mock-htlc-offer'
import issuance from '../../../models/mock/mock-issuance'

describe('wallet-ui/components/page-orders/order-offers-data', function () {
  let vm, offer, order
  beforeEach(function () {
    const htlcOfferMock = mockHtlcOffer()
    offer = htlcOfferMock.offer
    order = htlcOfferMock.order
    vm = new ViewModel({
      order,
      issuance
    })
  })
  describe('acceptOffer', function () {
    let getNextAddress, openAcceptOfferModal, calledCorrectly
    before(function () {
      openAcceptOfferModal = ViewModel.prototype.openAcceptOfferModal
      ViewModel.prototype.openAcceptOfferModal = function (offer, tx, issuance) {
        if (offer && issuance && tx && tx.htlcStep === 2) {
          calledCorrectly = true
        }
      }
      getNextAddress = Portfolio.prototype.getNextAddress
      // Fixture getNextAddress:
      Portfolio.prototype.getNextAddress = function () {
        console.log('MOCK: portfolio.getNextAddress')
        return Promise.resolve({
          EQB: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo',
          BTC: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
        })
      }
    })
    after(function () {
      ViewModel.prototype.openAcceptOfferModal = openAcceptOfferModal
      Portfolio.prototype.getNextAddress = getNextAddress
    })
    it('should call `openAcceptOfferModal` with correct params', function (done) {
      vm.acceptOffer(offer).then(function () {
        assert.ok(calledCorrectly)
        done()
      })
    })
  })
  describe('openAcceptOfferModal', function () {
    it('should set offer, tx and issuance and open the modal', function () {
      const offer = new Offer()
      const tx = new Transaction()
      assert.ok(!vm.isModalShown)
      vm.openAcceptOfferModal(offer, tx, issuance)
      assert.ok(vm.isModalShown)
      assert.equal(vm.offer, offer)
      assert.equal(vm.tx, tx)
      assert.equal(vm.issuance, issuance)
    })
  })
  describe('sendSecurities', function () {
    let txSave, offerSave, txSaved, offerSaved
    before(function () {
      txSave = Transaction.prototype.save
      Transaction.prototype.save = function () {
        txSaved = true
        return Promise.resolve(true)
      }
      offerSave = Offer.prototype.save
      Offer.prototype.save = function () {
        offerSaved = true
        return Promise.resolve(true)
      }
    })
    after(function () {
      Transaction.prototype.save = txSave
      Offer.prototype.save = offerSave
    })
    it('should save transaction and offer', function (done) {
      vm.offer = new Offer({
        timelock2: 72
      })
      vm.tx = new Transaction()
      vm.sendSecurities(72, 'description').then(function () {
        assert.ok(txSaved)
        assert.ok(offerSaved)
        done()
      })
    })
  })
})
