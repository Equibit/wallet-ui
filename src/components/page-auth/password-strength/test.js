import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './password-strength';

describe('components/page-auth/password-strength', function () {
  const vm = new ViewModel({});
  it('should detect Worst password', function () {
    vm.password = 'zxcvbn';
    assert.equal(vm.score, 0);
  });
  it('should detect Bad password', function () {
    vm.password = 'love88';
    assert.equal(vm.score, 1);
  });
  it('should detect Weak password', function () {
    vm.password = 'zhang198822';
    assert.equal(vm.score, 2);
  });
  it('should detect Good password', function () {
    vm.password = 'neverforget13/3/1997';
    assert.equal(vm.score, 3);
  });
  it('should detect Strong password', function () {
    vm.password = 'briansmith4mayor';
    assert.equal(vm.score, 4);
  });
});
