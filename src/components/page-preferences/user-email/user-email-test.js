import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './user-email';

describe('wallet-ui/components/page-preferences/user-email', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the user-email component');
  });
});
