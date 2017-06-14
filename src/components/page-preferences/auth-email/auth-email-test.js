import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './auth-email';

describe('wallet-ui/components/page-preferences/auth-email', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the auth-email component');
  });
});
