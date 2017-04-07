import QUnit from 'steal-qunit';
import { ViewModel } from './sign-up';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-auth/sign-up');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the sign-up component');
});
