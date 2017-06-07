import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './notifications-list';

describe('wallet-ui/components/notifications/notifications-list', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the notifications-list component');
  });
});
