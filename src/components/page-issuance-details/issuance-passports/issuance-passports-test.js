import QUnit from 'steal-qunit';
import { ViewModel } from './issuance-passports';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details/issuance-passports');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the issuance-passports component');
});
