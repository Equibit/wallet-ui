import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './offer-status';

describe('wallet-ui/components/page-offers/offer-status', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the offer-status component');
  });
});
