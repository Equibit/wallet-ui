import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './issuance-list';

describe('wallet-ui/components/page-my-issuances/issuance-list', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the issuance-list component');
  });
});
