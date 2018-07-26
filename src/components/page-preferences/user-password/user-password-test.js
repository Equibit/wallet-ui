import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './user-password'

describe('components/page-auth/user-password', function () {
  let vm
  beforeEach(function () {
    vm = new ViewModel({})
  })

  it('should reject Worst password', function () {
    vm.passwordNew = 'zxcvbn'
    assert.equal(vm.errors.password, null)
    vm.save()
    assert.equal(vm.errors.password, 'Password too weak')
  })
  it('should reject Bad password', function () {
    vm.passwordNew = 'love88'
    assert.equal(vm.errors.password, null)
    vm.save()
    assert.equal(vm.errors.password, 'Password too weak')
  })
  it('should reject Weak password', function () {
    vm.passwordNew = 'zhang198822'
    assert.equal(vm.errors.password, null)
    vm.save()
    assert.equal(vm.errors.password, 'Password too weak')
  })
  it('should reject Good password', function () {
    vm.passwordNew = 'neverforget13/3/1997'
    assert.equal(vm.errors.password, null)
    vm.save()
    assert.equal(vm.errors.password, 'Password too weak')
  })
  it('should accpet Strong password', function () {
    vm.passwordNew = 'briansmith4mayor'
    vm.passwordCurrent = 'password123'
    assert.equal(vm.errors.password, null)
    vm.save()
    assert.equal(vm.errors.password, null)
  })
})
