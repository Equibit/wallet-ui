import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './order-list'
import orderList from '~/models/fixtures/orders'

describe('wallet-ui/components/page-orders/order-list', function () {
  it('sets selected item based on mode', function () {
    var vm = new ViewModel({
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
})
