import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './time-remaining';

describe('wallet-ui/src/components/common/time-remaining', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the time-remaining component');
  });
});
