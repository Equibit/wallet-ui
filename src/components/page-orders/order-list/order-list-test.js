import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './order-list'
import orderList from '~/models/fixtures/orders'
import route from 'can-route'

describe('wallet-ui/components/page-orders/order-list', function () {
  it('sets selected item based on mode', function () {
    const vm = new ViewModel({
      items: orderList
    })
    assert.ok(vm.itemsFiltered.length > 0, 'Sanity check: filtered items exist')

    console.log('First item selected', vm.selectedItem, vm.itemsFiltered[0])
    assert.equal(vm.selectedItem._id, vm.itemsFiltered[0]._id, 'First item selected')

    vm.selectItem(vm.itemsFiltered[1])
    assert.equal(vm.selectedItem._id, vm.itemsFiltered[1]._id, 'Second item selected manually')

    vm.mode = 'BUY'
    assert.equal(vm.selectedItem._id, vm.itemsFiltered[0]._id, 'First item is selected after mode change')
  })

  it('sets selected item based on itemId on route', function () {
    const item = {
      _id: '12345',
      type: 'SELL'
    }
    const items = [{ _id: 'not12345', type: 'SELL' }, item]
    route.attr('itemId', item._id)
    const vm = new ViewModel()
    vm.items = items
    assert.deepEqual(vm.selectedItem, vm.itemsFiltered[1], 'Correct item is selected')
  })

  it('sets initial mode to BUY if item id\'d on route is BUY', function () {
    const item = {
      _id: '12345',
      type: 'BUY'
    }
    const items = [{ _id: 'not12345', type: 'SELL' }, item]
    route.attr('itemId', item._id)
    const vm = new ViewModel()
    vm.items = items
    assert.equal(vm.mode, 'BUY', 'Initial mode is BUY')
    assert.deepEqual(vm.selectedItem, item, 'Item is selected')
  })

  it('orders filtered items by most recent', function () {
    const items = [{
      _id: '2',
      createdAt: new Date(2017, 11, 2),
      type: 'SELL'
    }, {
      _id: '1',
      createdAt: new Date(2017, 11, 1),
      type: 'SELL'
    }, {
      _id: '3',
      createdAt: new Date(2017, 11, 3),
      type: 'SELL'
    }]
    const vm = new ViewModel()
    vm.items = items
    assert.deepEqual(vm.itemsFiltered.map(item => item._id), ['3', '2', '1'], 'Items are sorted')
  })
})
