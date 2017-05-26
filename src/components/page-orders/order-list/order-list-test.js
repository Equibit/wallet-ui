import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './order-list';

describe('wallet-ui/components/page-orders/order-list', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the order-list component');
  });
});
