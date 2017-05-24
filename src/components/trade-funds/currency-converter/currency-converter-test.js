import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './currency-converter';

describe('wallet-ui/components/trade-funds/currency-converter', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the currency-converter component');
  });
});
