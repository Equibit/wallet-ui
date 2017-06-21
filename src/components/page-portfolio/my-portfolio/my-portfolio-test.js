import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './my-portfolio';

describe('wallet-ui/components/page-portfolio/my-portfolio', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the my-portfolio component');
  });

  describe('prepareTransaction', function () {
    const vm = new ViewModel()

  });
});
