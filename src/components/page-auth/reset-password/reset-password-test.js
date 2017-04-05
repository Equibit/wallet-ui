/**
 * @module {can.Component} components/page-auth/reset-password Reset Password
 * @parent components.auth
 *
 * @link ../src/components/page-auth/reset-password/reset-password.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/reset-password/reset-password.html
 *
**/

import QUnit from 'steal-qunit';
import { ViewModel } from './forgot-password';

// ViewModel unit tests
QUnit.module('wallet-ui/components/page-auth/forgot-password');

QUnit.test('Has message', function () {
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the forgot-password component');
});
