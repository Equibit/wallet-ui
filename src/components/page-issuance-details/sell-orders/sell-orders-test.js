import QUnit from 'steal-qunit';
import { ViewModel } from './sell-orders';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details/sell-orders');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the sell-orders component');
});
