import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './cancel-order';

describe('wallet-ui/components/page-orders/cancel-order', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the cancel-order component');
  });
});
