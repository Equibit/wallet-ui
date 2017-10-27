import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './shareholders-grid'

describe('wallet-ui/components/page-issuance-details/shareholders-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the shareholders-grid component')
  })
})
