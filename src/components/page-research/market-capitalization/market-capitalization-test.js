import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './market-capitalization';

describe('wallet-ui/components/page-research/market-capitalization', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the market-capitalization component');
  });
});
