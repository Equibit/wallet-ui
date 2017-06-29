import QUnit from 'steal-qunit'
import { ViewModel } from './grid-issuances'

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuances/grid-issuances')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the grid-issuances component')
})
