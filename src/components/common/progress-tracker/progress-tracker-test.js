import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './progress-tracker';

describe('wallet-ui/components/common/progress-tracker', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the progress-tracker component');
  });
});
