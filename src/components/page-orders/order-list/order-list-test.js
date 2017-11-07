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

    assert.equal(vm.selectedIndex, 0, 'First item selected')

    vm.selectedIndex = 1
    assert.equal(vm.selectedItem, vm.itemsFiltered[vm.selectedIndex], 'Second item selected manually')

    vm.mode = 'BUY'
    assert.equal(vm.selectedIndex, 0, 'Selected index is zero after mode change')
    assert.equal(vm.selectedItem, vm.itemsFiltered[vm.selectedIndex], 'First item selected automatically')
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
    assert.equal(vm.selectedIndex, 1, 'Selected index is correct')
    assert.equal(vm.selectedItem, item, 'Item is selected')
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
    assert.equal(vm.selectedItem, item, 'Item is selected')
  })
})
