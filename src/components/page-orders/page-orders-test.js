import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './page-orders';

describe('wallet-ui/components/page-orders', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the page-orders component');
  });
});
