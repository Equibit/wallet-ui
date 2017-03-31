import QUnit from 'steal-qunit';
import { ViewModel } from './change-password';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-auth/change-password');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the change-password component');
});
