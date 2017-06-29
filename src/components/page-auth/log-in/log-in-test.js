import QUnit from 'steal-qunit'
import { ViewModel } from './log-in'

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-auth/log-in')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the log-in component')
})
