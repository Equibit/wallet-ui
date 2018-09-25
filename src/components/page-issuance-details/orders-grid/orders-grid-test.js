import 'steal-mocha'
import { assert, expect } from 'chai'
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
    const vm = new ViewModel({
      type: 'SELL',
      issuanceAddress: 'baadf00d',
    })

    expect(vm.marketWidth).to.deep.equal([], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      vm.rows.forEach(row => {
        expect(vm.whyUserCantOffer(row)).to.equal('Not logged in')
      })
    })
    done()
  })

  it('whyUserCantOffer allows buy request from user with sufficient funds', function (done) {
    const vm = new ViewModel({
      type: 'SELL',
      issuanceAddress: 'baadf00d',
      session: Session.current
    })

    expect(vm.marketWidth).to.deep.equal([], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      vm.rows.forEach(row => {
        expect(vm.whyUserCantOffer(row)).to.equal(null)
      })
    })
    done()
  })

  it('whyUserCantOffer rejects buy request from user with insufficient funds', function (done) {
    const vm = new ViewModel({
      type: 'SELL',
      issuanceAddress: 'baadf00d',
      session: new Session({
        user: userMock,
        portfolios: [portfolio],
        balance: {cashBtc: 0, blankEqb: 0, cashTotal: 0, securities: 0, total: 0}
      })
    })

    expect(vm.marketWidth).to.deep.equal([], 'Market widths is an empty array before rows are loaded')
    vm.on('rows', () => {
      vm.rows.forEach(row => {
        expect(vm.whyUserCantOffer(row)).to.equal('No funds')
      })
    })
    done()
  })
})
