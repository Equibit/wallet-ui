import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './page-my-issuances';

describe('wallet-ui/components/page-my-issuances', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the page-my-issuances component');
  });
});
