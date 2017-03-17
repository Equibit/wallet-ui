import QUnit from 'steal-qunit';
import { ViewModel } from './page-login';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-login');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-login component');
});
