import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './bonds-grid';

describe('wallet-ui/components/page-portfolio/bonds-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the bonds-grid component');
  });
});
