import QUnit from 'steal-qunit';
import { ViewModel } from './issuance-sell-orders';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details/issuance-sell-orders');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the issuance-sell-orders component');
});
