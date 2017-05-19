import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './receive-funds';

describe('wallet-ui/components/trade-funds/receive-funds', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the receive-funds component');
  });
});
