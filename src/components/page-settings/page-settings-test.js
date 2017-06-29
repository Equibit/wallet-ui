import QUnit from 'steal-mocha'
import { ViewModel } from './page-settings'

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-settings')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the page-settings component')
})
