import 'steal-mocha'
import assert from 'chai/chai'
import DefineMap from 'can-define/map/map'
import typeforce from 'typeforce'
import Order from '~/models/order'
import Offer from '~/models/offer'
import eventHub from '~/utils/event-hub'
import { translate } from '~/i18n/'
import Session from '../../../models/session'
import '../../../models/mock/mock-session'
import issuance from '../../../models/mock/mock-issuance'
import portfolio from '../../../models/mock/mock-portfolio'

import { ViewModel, createHtlcOffer, generateSecret, createHtlcTx } from './order-book'

// ViewModel unit tests
describe('wallet-ui/components/page-issuance-details/order-book', function () {
  describe('placeOrder', function () {
    const formData = new (DefineMap.extend('FormData', {seal: false}, {}))({
      order: {
        _id: '2345',
        price: '12'
      },
      quantity: 500
    })

    let _sendMessage
    let _orderSave

    beforeEach(function () {
      _sendMessage = ViewModel.prototype.sendMessage
      ViewModel.prototype.sendMessage = (order) => {
        return Promise.resolve(order)
      }
      _orderSave = Order.prototype.save
      Order.prototype.save = (order) => {
        return Promise.resolve(order)
      }
    })

    afterEach(function () {
      Order.prototype.save = _orderSave
      ViewModel.prototype.sendMessage = _sendMessage
    })

    it('creates Order from Issuance and Portfolio', function (done) {
      const vm = new ViewModel({ issuance, portfolio })
      const unusedNextAddress = portfolio.keys.BTC.derive(0).derive(2).getAddress()
      ViewModel.prototype.sendMessage = order => {
        assert.equal(order.issuanceAddress, issuance.issuanceAddress, 'Address from issuance')
        assert.equal(order.companyName, issuance.companyName, 'Company name from issuance')
        assert.equal(order.issuanceName, issuance.issuanceName, 'Issuance name from issuance')
        assert.equal(order.issuanceType, issuance.issuanceType, 'Issuance type from issuance')
        assert.equal(order.portfolioId, portfolio._id, 'Portfolio ID from portfolio')
        assert.equal(order.sellAddressBtc, unusedNextAddress, 'BTC Address')
        assert.equal(order.buyAddressEqb, '', 'Empty buyAddressEqb')
        return Promise.resolve(order)
      }
      vm.placeOrder([null, formData, 'SELL']).then(() => done())
    })

    it('Dispatches created alert to hub', function (done) {
      const vm = new ViewModel({ issuance, portfolio })
      let handler = function (data) {
        assert.equal(data.kind, 'success', 'Success message generated')
        assert.equal(data.title, translate('orderWasCreated'), 'Correct message text')
        done()
      }
      eventHub.on('alert', handler)
      vm.placeOrder([null, formData, 'SELL']).then(() => {
        eventHub.off('alert', handler)
      })
    })
  })

  describe('Place a new offer', function () {
    const formData = new (DefineMap.extend('FormData', {seal: false}, {}))({
      order: {
        _id: '2345',
        price: '12'
      },
      quantity: 500
    })

    describe('generateSecret', function () {
      it('should generate 32 random bytes', function () {
        const secret = generateSecret()
        assert.ok(typeforce('Buffer', secret))
        assert.equal(secret.length, 32)
      })
    })

    describe('HTLC', function () {
      const secret = generateSecret()
      const eqbAddress = 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'
      const refundBtcAddress = 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
      const htlcOffer = createHtlcOffer(formData, 'BUY', secret, Session.current.user, issuance, eqbAddress, refundBtcAddress)

      describe('createHtlcOffer', function () {
        it('should create HTLC offer', function () {
          console.log('htlcOffer', htlcOffer)
          assert.equal(htlcOffer.quantity, 500)
          assert.equal(htlcOffer.eqbAddress, eqbAddress)
          assert.equal(htlcOffer.refundBtcAddress, refundBtcAddress)
          assert.ok(htlcOffer.secretEncrypted)
          assert.equal(htlcOffer.secretHash.length, 64, '(256 bit) = (32 bytes) = (64 hex chars)')
          assert.equal(htlcOffer.type, 'BUY')
        })
      })

      describe.skip('createHtlcTx', function () {
        it('should create HTLC transaction', function () {
          const tx = createHtlcTx(htlcOffer)
          console.log('tx', tx)
          assert.equal(tx.type, 'BUY')
        })
      })
    })

    describe.skip('placeOffer', function () {
      let _offerSave

      beforeEach(function () {
        _offerSave = Offer.prototype.save
        Offer.prototype.save = (offer) => {
          return Promise.resolve(offer)
        }
      })

      afterEach(function () {
        Offer.prototype.save = _offerSave
      })

      it('creates Offer from Issuance and Order', function (done) {
        const vm = new ViewModel({ issuance, portfolio })
        Offer.prototype.save = function () {
          assert.equal(this.issuanceAddress, issuance.issuanceAddress, 'Address from issuance')
          assert.equal(this.companyName, issuance.companyName, 'Company name from issuance')
          assert.equal(this.issuanceName, issuance.issuanceName, 'Issuance name from issuance')
          assert.equal(this.issuanceType, issuance.issuanceType, 'Issuance type from issuance')
          assert.equal(this.orderId, formData.order._id, 'Order ID from order')
          assert.equal(this.price, formData.order.price, 'Price from order')
          done()
          return Promise.resolve(this)
        }
        vm.placeOffer([null, formData, 'BUY'])
      })

      it('Dispatches created alert to hub', function (done) {
        const vm = new ViewModel({ issuance, portfolio })
        let handler = function (data) {
          assert.equal(data.kind, 'success', 'Success message generated')
          assert.equal(data.title, translate('offerWasCreated'), 'Correct title text')
          assert.ok(~data.message.indexOf(translate('viewDetails')), 'Correct link text')
          assert.ok(~data.message.indexOf('<a') && ~data.message.indexOf('</a>'), 'Message contains a link')
          eventHub.off('alert', handler)
          done()
        }
        eventHub.on('alert', handler)
        vm.placeOffer([null, formData, 'BUY'])
      })
    })
  })
})
