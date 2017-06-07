import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './page-transactions';

describe('wallet-ui/components/page-transactions', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the page-transactions component');
  });
});
