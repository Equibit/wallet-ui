import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './equity-grid';

describe('wallet-ui/components/page-portfolio/equity-grid', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the equity-grid component');
  });
});
