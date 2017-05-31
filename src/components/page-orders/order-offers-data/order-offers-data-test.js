import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './order-offers-data';

describe('wallet-ui/components/page-orders/order-offers-data', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the order-offers-data component');
  });
});
