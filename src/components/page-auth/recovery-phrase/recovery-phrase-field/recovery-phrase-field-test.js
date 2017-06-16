import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './recovery-phrase-field';

describe('wallet-ui/components/page-auth/recovery-phrase/recovery-phrase-field', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the recovery-phrase-field component');
  });
});
