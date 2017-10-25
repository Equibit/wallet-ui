import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './passport-confirm';

describe('wallet-ui/components/page-trading-passports/create-passport/passport-confirm', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the passport-confirm component');
  });
});
