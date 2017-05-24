import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './currency-converter';

describe('wallet-ui/components/trade-funds/currency-converter', function () {
  var vm = new ViewModel({
    input: 10,
    currency: {
      rate: 2
    }
  });
  it('should convert input', function () {
    assert.equal(vm.output, '20.00');
  });
  it('should convert output', function () {
    vm.output = '1,500.00';
    assert.equal(vm.input, '750');
  });
});
