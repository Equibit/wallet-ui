import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './transactions-grid';

describe('wallet-ui/components/page-transactions/transactions-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the transactions-grid component');
  });
});
