import QUnit from 'steal-qunit';
import { ViewModel } from './candlestick-chart';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-issuance-details/candlestick-chart');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the candlestick-chart component');
});
