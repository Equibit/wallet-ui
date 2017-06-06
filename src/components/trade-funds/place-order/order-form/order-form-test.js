import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './order-form';

describe('wallet-ui/components/trade-funds/place-order/order-form', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the order-form component');
  });
});
