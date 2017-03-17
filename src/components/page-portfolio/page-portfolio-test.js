import QUnit from 'steal-qunit';
import { ViewModel } from './page-portfolio';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-portfolio');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-portfolio component');
});
