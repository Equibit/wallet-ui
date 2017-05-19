import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './send-funds';

describe('wallet-ui/components/trade-funds/send-funds', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the send-funds component');
  });
});
