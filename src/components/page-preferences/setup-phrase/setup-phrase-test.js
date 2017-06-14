import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './setup-phrase';

describe('wallet-ui/components/page-preferences/setup-phrase', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the setup-phrase component');
  });
});
