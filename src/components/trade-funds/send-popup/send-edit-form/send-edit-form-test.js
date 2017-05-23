import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './send-edit-form';

describe('wallet-ui/components/trade-funds/send-popup/send-edit-form', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the send-edit-form component');
  });
});
