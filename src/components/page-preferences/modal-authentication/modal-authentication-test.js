import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './modal-authentication';

describe('wallet-ui/components/page-preferences/modal-authentication', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the modal-authentication component');
  });
});
