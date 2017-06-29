import QUnit from 'steal-qunit'
import { ViewModel } from './forgot-password'

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-auth/forgot-password')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the forgot-password component')
})
