import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './questionnaire-promo';

describe('wallet-ui/questionnaire-promo', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the questionnaire-promo component');
  });
});
