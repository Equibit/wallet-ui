import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './user-autologout';

describe('wallet-ui/components/page-preferences/user-autologout', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the user-autologout component');
  });
});
