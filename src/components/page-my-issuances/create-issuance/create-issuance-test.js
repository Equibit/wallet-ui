import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './create-issuance'

describe('wallet-ui/components/page-my-issuances/create-issuance', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the create-issuance component')
  })
})
