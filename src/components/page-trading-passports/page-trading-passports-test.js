import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './page-trading-passports'

describe('wallet-ui/components/page-trading-passports', function () {
  it('should have message', function () {
    var vm = new ViewModel()
    assert.equal(vm.message, 'This is the page-trading-passports component')
  });
});
