import QUnit from 'steal-qunit';
import { ViewModel } from './share-performance-chart';

// ViewModel unit tests
QUnit.module('wallet-ui/components/common/share-performance-chart');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the share-performance-chart component');
});
