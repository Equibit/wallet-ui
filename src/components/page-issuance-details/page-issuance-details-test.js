import QUnit from 'steal-qunit';
import { ViewModel } from './page-issuance-details';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-issuance-details component');
});
