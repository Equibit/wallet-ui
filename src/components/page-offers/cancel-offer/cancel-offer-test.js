import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './cancel-offer';

describe('wallet-ui/components/page-offers/cancel-offer', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the cancel-offer component');
  });
});
