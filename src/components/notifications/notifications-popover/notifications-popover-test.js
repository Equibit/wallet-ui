import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './notifications-popover';

describe('wallet-ui/components/notifications/notifications-popover', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the notifications-popover component');
  });
});
