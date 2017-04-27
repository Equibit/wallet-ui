import QUnit from 'steal-qunit';
import { ViewModel } from './market-depth';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details/market-depth');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the issuance-market-depth component');
});
