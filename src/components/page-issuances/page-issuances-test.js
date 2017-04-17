import QUnit from 'steal-qunit';
import { ViewModel } from './page-issuances';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuances');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-issuances component');
});
