import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './biggest-movers';

describe('wallet-ui/components/page-research/biggest-movers', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the biggest-movers component');
  });
});
