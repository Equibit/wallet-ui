import QUnit from 'steal-mocha';
import { ViewModel } from './signup';

// ViewModel unit tests
QUnit.module('wallet-ui/signup');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-signup component');
});
