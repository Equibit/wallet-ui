import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './password-strength';

describe('wallet-ui/components/page-auth/password-strength', function () {
  const vm = new ViewModel({});
  it('should detect very weak password', function () {
    vm.password = 'test';
    assert.equal(vm.score, 0);
  });
  it('should detect weak password', function () {
    vm.password = 'mypass123';
    assert.equal(vm.score, 1);
  });
  it('should detect medium password', function () {
    vm.password = 'mypass123P';
    assert.equal(vm.score, 2);
  });
  it('should detect strong password', function () {
    vm.password = 'mypass123Psw';
    assert.equal(vm.score, 3);
  });
  it('should detect very strong password', function () {
    vm.password = 'mypass123Psw@#';
    assert.equal(vm.score, 4);
  });
});
