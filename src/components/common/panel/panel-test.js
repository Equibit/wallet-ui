import QUnit from 'steal-qunit';
import { ViewModel } from './panel';

// ViewModel unit tests
QUnit.module('wallet-ui/components/common/panel');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the drag-panel component');
});
