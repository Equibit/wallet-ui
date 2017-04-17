import QUnit from 'steal-qunit';
import { ViewModel } from './issuance-info';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuances/issuance-info');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the issuance-info component');
});
