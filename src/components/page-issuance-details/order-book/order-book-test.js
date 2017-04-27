import QUnit from 'steal-qunit';
import { ViewModel } from './order-book';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details/order-book');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the order-book component');
});
