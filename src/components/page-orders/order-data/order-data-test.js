import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './order-data';

describe('wallet-ui/components/page-orders/order-data', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the order-data component');
  });
});
