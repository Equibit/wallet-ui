import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './modal-confirm-funds';

describe('wallet-ui/components/page-auth/recovery-phrase/modal-confirm-funds', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the modal-confirm-funds component');
  });
});
