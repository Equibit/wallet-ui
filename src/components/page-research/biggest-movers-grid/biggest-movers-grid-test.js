import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './biggest-movers-grid';

describe('wallet-ui/components/page-research/biggest-movers-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the biggest-movers-grid component');
  });
});
