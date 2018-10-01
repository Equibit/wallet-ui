import 'steal-mocha'
import assert from 'chai/chai'
import { ViewModel } from './orders-grid'
import Order from '~/models/order'
import Session from '~/models/session'
import '~/models/mock/mock-session'
import userMock from '~/models/mock/mock-user'
import portfolio from '~/models/mock/mock-portfolio'

// ViewModel unit tests
describe('wallet-ui/components/page-issuance-details/orders-grid', () => {
  let oldGetList
  beforeEach(() => {
    oldGetList = Order.getList
    Order.getList = function () {
      return Promise.resolve([{
        id: 1,
        quantity: 100
      }, {
        id: 2,
        quantity: 200
      }])
    }
  })
  afterEach(() => {
    Order.getList = oldGetList
  })

  it('Total reflects all orders', function (done) {
    const vm = new ViewModel({ issuanceAddress: 'baadf00d' })

    assert.equal(vm.totalQuantity, 0, 'Total quantity is 0 before rows are loaded')
    vm.on('totalQuantity', () => {
      assert.equal(vm.totalQuantity, 300, 'Total quantity is the quantity sum after rows are loaded')
      done()
    })
  })

  it('Market width (not left offset)', function (done) {
    const vm = new ViewModel({
      type: 'BUY',
      issuanceAddress: 'baadf00d'
    })

    assert.deepEqual(vm.marketWidth, [], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      assert.deepEqual(vm.marketWidth, [33, 99], 'Market widths are correct after rows are loaded')
      done()
    })
  })

  it('Market width (left offset)', function (done) {
    const vm = new ViewModel({
      issuanceAddress: 'baadf00d',
      type: 'SELL'
    })

    assert.deepEqual(vm.marketWidth, [], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      assert.deepEqual(vm.marketWidth, [67, 1], 'Market widths are correct after rows are loaded')
      done()
    })
  })

  it('Market width changes with row update', function (done) {
    const vm = new ViewModel({
      type: 'BUY',
      issuanceAddress: 'baadf00d'
    })

    assert.deepEqual(vm.marketWidth, [], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      vm.rows.splice(1, 0, {
        id: 3,
        quantity: 100
      })
      assert.deepEqual(vm.marketWidth, [25, 50, 99], 'Market widths are correct after row is inserted')
      done()
    })
  })

  it('whyUserCantOffer detects a not logged in user', function async (done) {
    Session.current = null
    const vm = new ViewModel({
      type: 'SELL',
      issuanceAddress: 'baadf00d'
    })

    assert.deepEqual(vm.marketWidth, [], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      assert.deepEqual(vm.marketWidth, [67, 1], 'Market widths are correct after rows are loaded')
      vm.rows.forEach(row => {
        assert.equal(vm.whyUserCantOffer(row), 'Not logged in', 'An unauthenticated session cannot make offers')
      })
      done()
    })
  })

  it('whyUserCantOffer allows buy request from user with sufficient funds', function (done) {
    Session.current = {
      user: userMock,
      portfolios: [portfolio],
      hasIssuanceUtxo () {
        return true
      }
    }
    const vm = new ViewModel({
      type: 'SELL',
      issuanceAddress: 'baadf00d',
      portfolio: {
        hasEnoughFunds () {
          return true
        }
      }
    })

    assert.deepEqual(vm.marketWidth, [], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      assert.deepEqual(vm.marketWidth, [67, 1], 'Market widths are correct after rows are loaded')
      vm.rows.forEach(row => {
        assert.equal(vm.whyUserCantOffer(row), null, 'A valid user can make offers')
      })
      done()
    })
  })

  it('whyUserCantOffer rejects buy request from user with insufficient funds', function (done) {
    Session.current = {
      user: userMock,
      portfolios: [portfolio],
      hasIssuanceUtxo () {
        return true
      }
    }
    const vm = new ViewModel({
      type: 'SELL',
      issuanceAddress: 'baadf00d',
      assetType: 'EQUIBIT',
      portfolio: {
        hasEnoughFunds () {
          return false
        }
      }
    })

    assert.deepEqual(vm.marketWidth, [], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      assert.deepEqual(vm.marketWidth, [67, 1], 'Market widths are correct after rows are loaded')
      vm.rows.forEach(row => {
        assert.equal(vm.whyUserCantOffer(row), 'No funds', 'User without funds cannot make offers')
      })
      done()
    })
  })
})
