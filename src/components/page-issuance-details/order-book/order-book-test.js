import 'steal-mocha'
import assert from 'chai/chai'
import DefineMap from 'can-define/map/map'
import typeforce from 'typeforce'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import eventHub from '~/utils/event-hub'
import { translate } from '~/i18n/'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import '../../../models/mock/mock-session'
import issuance from '../../../models/mock/mock-issuance'
import portfolio from '../../../models/mock/mock-portfolio'
import orderFixturesData from '../../../models/fixtures/orders'

import { ViewModel, createHtlcOffer, generateSecret } from './order-book'

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
      const unusedNextBtcAddress = portfolio.keys.BTC.derive(0).derive(2).getAddress()
      const unusedNextEqbAddress = portfolio.keys.EQB.derive(0).derive(1).getAddress()
      ViewModel.prototype.sendMessage = order => {
        assert.equal(order.issuanceId, issuance._id, 'issuanceId from issuance')
        assert.equal(order.issuanceAddress, issuance.issuanceAddress, 'Address from issuance')
        assert.equal(order.companyName, issuance.companyName, 'Company name from issuance')
        assert.equal(order.issuanceName, issuance.issuanceName, 'Issuance name from issuance')
        assert.equal(order.issuanceType, issuance.issuanceType, 'Issuance type from issuance')
        assert.equal(order.portfolioId, portfolio._id, 'Portfolio ID from portfolio')
        assert.equal(order.btcAddress, unusedNextBtcAddress, 'BTC address')
        assert.equal(order.eqbAddressHolding, unusedNextEqbAddress, 'EQB address')
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
    const orderData = Object.assign({}, orderFixturesData[0], { issuance: issuance })
    const order = new Order(orderData)
    const formData = new (DefineMap.extend('OfferFormData', {seal: false}, {}))({
      order,
      quantity: 500
    })

    describe('generateSecret', function () {
      it('should generate 32 random bytes', function () {
        const secret = generateSecret()
        assert.ok(typeforce('Buffer', secret))
        assert.equal(secret.length, 32)
      })
    })

    describe('HTLC utils', function () {
      const secret = generateSecret()
      const timelock = 20
      const eqbAddress = 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'
      const refundBtcAddress = 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
      // const changeBtcAddressPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }
      const htlcOffer = createHtlcOffer(formData, 'BUY', secret, timelock, Session.current.user, issuance, eqbAddress, refundBtcAddress)

      describe('createHtlcOffer', function () {
        it('should have quantity', function () {
          console.log('htlcOffer', htlcOffer)
          assert.equal(htlcOffer.quantity, 500)
        })
        it('should set eqbAddressTrading', function () {
          assert.equal(htlcOffer.eqbAddressTrading, eqbAddress)
        })
        // todo: holding address should be different than trading.
        it('should set eqbAddressHolding ???', function () {
          assert.equal(htlcOffer.eqbAddressHolding, eqbAddress)
        })
        it('should set btcAddress for refund', function () {
          assert.equal(htlcOffer.btcAddress, refundBtcAddress)
        })
        it('should set secretEncrypted', function () {
          assert.ok(htlcOffer.secretEncrypted)
        })
        it('should set timelock', function () {
          assert.equal(htlcOffer.timelock, timelock)
        })
        it('should set hashlock', function () {
          assert.equal(htlcOffer.hashlock.length, 64, '(256 bit) = (32 bytes) = (64 hex chars)')
        })
        it('should set type', function () {
          assert.equal(htlcOffer.type, 'BUY')
        })
        it('should set issuanceId', function () {
          assert.equal(htlcOffer.issuanceId, issuance._id)
        })
        it('should set htlcStep', function () {
          assert.equal(htlcOffer.htlcStep, 1)
        })
      })

      // todo: move to this transaction-utils test and js.
      describe.skip('createHtlcTx', function () {
        let tx
        // tx = createHtlcTx(htlcOffer, order, portfolio, issuance, changeBtcAddressPair)
        console.log('tx', tx)
        it('should have the correct type', function () {
          assert.equal(tx.type, 'BUY')
        })
        it('should have amount = quantity * price', function () {
          assert.equal(tx.amount, formData.quantity * order.price)
        })
        it.skip('should have BTC transaction hex and id', function () {
          assert.ok(tx.hex)
          assert.ok(tx.txId)
          assert.ok(tx.currencyType, 'BTC')
        })
        it('should have issuance details', function () {
          assert.equal(tx.companyName, 'Equibit Group')
          assert.equal(tx.issuanceName, 'Series One')
        })
        it('should have fromAddress', function () {
          assert.ok(tx.fromAddress)
        })
        it('should have toAddress', function () {
          assert.equal(tx.toAddress, order.btcAddress)
        })
        it('should have refundAddress', function () {
          assert.equal(tx.refundAddress, htlcOffer.btcAddress)
        })
        it('should have timelock', function () {
          assert.equal(tx.timelock, htlcOffer.timelock)
        })
      })
    })

    // todo: figure out why testee gets max stack overflow because of this test.
    describe.skip('placeOffer', function () {
      let _offerSave, _transactionSave

      beforeEach(function () {
        _offerSave = Offer.prototype.save
        _transactionSave = Transaction.prototype.save
        Offer.prototype.save = (offer) => {
          return Promise.resolve(offer)
        }
        Transaction.prototype.save = (tx) => {
          return Promise.resolve(tx)
        }
      })

      afterEach(function () {
        Offer.prototype.save = _offerSave
        Transaction.prototype.save = _transactionSave
      })

      it('creates Transaction item', function (done) {
        const vm = new ViewModel({ issuance, portfolio })
        Transaction.prototype.save = function () {
          assert.equal(this.amount, formData.quantity, 'Amount')
          assert.equal(this.type, 'BUY', 'Type')
          assert.ok(this.hex, 'Transaction hex')
          assert.ok(this.txId, 'Transaction BTC id')
          assert.ok(this.currencyType, 'Transaction currencyType')
          return Promise.resolve(this)
        }
        vm.placeOffer([null, formData, 'BUY'])
          .then(() => done())
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
          return Promise.resolve(this)
        }
        vm.placeOffer([null, formData, 'BUY'])
          .then(() => done())
      })

      it('Dispatches created alert to hub', function (done) {
        const vm = new ViewModel({ issuance, portfolio })
        let handler = function (data) {
          assert.equal(data.kind, 'success', 'Success message generated')
          assert.equal(data.title, translate('offerWasCreated'), 'Correct title text')
          assert.ok(~data.message.indexOf(translate('viewDetails')), 'Correct link text')
          assert.ok(~data.message.indexOf('<a') && ~data.message.indexOf('</a>'), 'Message contains a link')
          eventHub.off('alert', handler)
        }
        eventHub.on('alert', handler)
        vm.placeOffer([null, formData, 'BUY'])
          .then(() => done())
      })
    })
  })
})
