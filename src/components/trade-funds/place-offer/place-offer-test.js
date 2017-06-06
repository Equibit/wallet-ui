import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './place-offer';

describe('wallet-ui/components/trade-funds/place-offer', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the place-offer component');
  });
});
