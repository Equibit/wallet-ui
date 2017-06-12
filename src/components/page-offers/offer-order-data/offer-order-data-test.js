import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './offer-order-data';

describe('wallet-ui/components/page-offers/offer-order-data', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the offer-order-data component');
  });
});
