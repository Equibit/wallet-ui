import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './recovery-phrase-modal';

describe('wallet-ui/components/page-auth/recovery-phrase/recovery-phrase-modal', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the recovery-phrase-modal component');
  });
});
