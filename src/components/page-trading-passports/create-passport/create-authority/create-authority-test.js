import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './create-authority';

describe('wallet-ui/components/page-trading-passports/create-passport/create-authority', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the create-authority component');
  });
});
