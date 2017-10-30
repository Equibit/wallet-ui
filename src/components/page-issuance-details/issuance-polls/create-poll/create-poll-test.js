import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './create-poll';

describe('wallet-ui/components/page-issuance-details/issuance-polls/create-poll', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the create-poll component');
  });
});
