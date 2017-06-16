import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './recovery-phrase-prompt';

describe('wallet-ui/components/page-auth/recovery-phrase/recovery-phrase-prompt', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the recovery-phrase-prompt component');
  });
});
