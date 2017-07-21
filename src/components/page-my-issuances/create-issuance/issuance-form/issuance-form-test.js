import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './issuance-form';

describe('wallet-ui/components/page-my-issuances/create-issuance/issuance-form', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the issuance-form component');
  });
});
