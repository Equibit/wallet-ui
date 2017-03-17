import QUnit from 'steal-mocha';
import { ViewModel } from './page-four-oh-four';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-four-oh-four');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-four-oh-four component');
});
