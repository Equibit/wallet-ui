import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './transactions-grid'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/'

describe('wallet-ui/components/page-transactions/transactions-grid', function () {
  it('should define queryParams', function () {
    var vm = new ViewModel({
      addresses: new DefineMap({ 'BTC': new DefineList([1, 2]), 'EQB': new DefineList([3, 4]) })
    })
    assert.deepEqual(vm.queryParams, {
      $limit: 50,
      $skip: 0,
      $or: [{
        fromAddress: { '$in': [1, 2, 3, 4] }
      }, {
        toAddress: { '$in': [1, 2, 3, 4] }
      }],
      $sort: { createdAt: -1 }
    })
  })
})
