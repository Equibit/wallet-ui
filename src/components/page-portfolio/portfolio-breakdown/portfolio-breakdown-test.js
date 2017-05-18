import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './portfolio-breakdown';

describe('wallet-ui/components/page-portfolio/portfolio-breakdown', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the portfolio-breakdown component');
  });
});
