import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './transactions-details';

describe('wallet-ui/components/page-transactions/transactions-details', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the transaction-details component');
  });
});
