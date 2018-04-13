import QUnit from 'steal-qunit'
import { ViewModel } from './page-equibit'

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-equibit')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the page-equibit component')
})
