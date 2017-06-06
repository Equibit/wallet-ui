import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './place-order';

describe('wallet-ui/components/trade-funds/place-order', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the place-order component');
  });
});
