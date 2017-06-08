import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './notification-indicator';

describe('wallet-ui/components/notifications/notification-indicator', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the notification-indicator component');
  });
});
