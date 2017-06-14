import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './page-preferences';

describe('wallet-ui/components/page-preferences', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the page-preferences component');
  });
});
