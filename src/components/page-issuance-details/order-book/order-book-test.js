import 'steal-mocha'
import assert from 'chai/chai'
import { ViewModel } from './order-book'
import Order from '~/models/order'
import Offer from '~/models/offer'
import eventHub from '~/utils/event-hub'
import { translate } from '~/i18n/'
import Session from '../../../models/session'

// ViewModel unit tests
describe('wallet-ui/components/page-issuance-details/order-book', function () {
  const issuance = {
    issuanceAddress: '1234',
    companyName: 'Foo',
    issuanceName: 'Bar',
    issuanceType: 'Baz',
    keys: {}
  }
  const portfolio = {
    _id: '5678'
  }

  before(function () {
    Session.current = { user: {} }
  })

  describe('placeOrder', function () {
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
      ViewModel.prototype.sendMessage = order => {
        assert.equal(order.issuanceAddress, issuance.issuanceAddress, 'Address from issuance')
        assert.equal(order.companyName, issuance.companyName, 'Company name from issuance')
        assert.equal(order.issuanceName, issuance.issuanceName, 'Issuance name from issuance')
        assert.equal(order.issuanceType, issuance.issuanceType, 'Issuance type from issuance')
        assert.equal(order.portfolioId, portfolio._id, 'Portfolio ID from portfolio')
        return Promise.resolve(order)
      }
      vm.placeOrder([null, {}]).then(() => done())
    })

    it('Dispatches created alert to hub', function (done) {
      const vm = new ViewModel({ issuance, portfolio })
      let handler = function (data) {
        assert.equal(data.kind, 'success', 'Success message generated')
        assert.equal(data.title, translate('orderWasCreated'), 'Correct message text')
        done()
      }
      eventHub.on('alert', handler)
      vm.placeOrder([null, {}]).then(() => {
        eventHub.off('alert', handler)
      })
    })
  })

  describe('placeOffer', function () {
    let _offerSave
    const order = {
      _id: '2345',
      price: '12'
    }

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
        assert.equal(this.orderId, order._id, 'Order ID from order')
        assert.equal(this.price, order.price, 'Price from order')
        done()
        return Promise.resolve(this)
      }
      vm.placeOffer([null, {order}])
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
      vm.placeOffer([null, {order}])
    })
  })
})
