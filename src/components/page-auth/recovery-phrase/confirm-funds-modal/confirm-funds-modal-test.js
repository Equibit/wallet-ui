import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './confirm-funds-modal';

describe('wallet-ui/components/page-auth/recovery-phrase/confirm-funds-modal', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the confirm-funds-modal component');
  });
});
