import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './portfolio-toolbar';

describe('wallet-ui/components/page-portfolio/portfolio-toolbar', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the portfolio-toolbar component');
  });
});
