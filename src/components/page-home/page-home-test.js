import QUnit from 'steal-mocha';
import { ViewModel } from './page-home';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-home');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-home component');
});
