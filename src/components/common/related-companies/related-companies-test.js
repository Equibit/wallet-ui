import QUnit from 'steal-qunit';
import { ViewModel } from './related-companies';

// ViewModel unit tests
QUnit.module('wallet-ui/components/common/related-companies');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the related-companites component');
});
