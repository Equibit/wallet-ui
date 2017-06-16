import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './modal-recovery-phrase-prompt';

describe('wallet-ui/components/page-auth/recovery-phrase/modal-recovery-phrase-prompt', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the modal-recovery-phrase-prompt component');
  });
});
