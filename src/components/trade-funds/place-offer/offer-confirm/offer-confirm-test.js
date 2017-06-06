import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './offer-confirm';

describe('wallet-ui/components/trade-funds/place-offer/offer-confirm', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the offer-confirm component');
  });
});
