import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './offer-form';

describe('wallet-ui/components/trade-funds/place-offer/offer-form', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the offer-form component');
  });
});
