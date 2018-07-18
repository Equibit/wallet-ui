import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './change-password'
import User from '../../../models/user/user'

describe('components/page-auth/change-password', function () {
  let vm, event
  beforeEach(function () {
    vm = new ViewModel({})
    event = document.createEvent('Event')
    event.initEvent('submit', true, true)
  })

  it('should reject Worst password', function () {
    vm.password = 'zxcvbn'
    User.signup('test@evenset.com').then(function (data) {
      this.user = data
      assert.equal(vm.passwordError, '')
      vm.handlePasswordChange(event, vm.password)
      assert.equal(vm.passwordError, 'Password too weak')
    })
  })
  it('should reject Bad password', function () {
    vm.password = 'love88'
    User.signup('test@evenset.com').then(function (data) {
      this.user = data
      assert.equal(vm.passwordError, '')
      vm.handlePasswordChange(event, vm.password)
      assert.equal(vm.passwordError, 'Password too weak')
    })
  })
  it('should reject Weak password', function () {
    vm.password = 'zhang198822'
    User.signup('test@evenset.com').then(function (data) {
      this.user = data
      assert.equal(vm.passwordError, '')
      vm.handlePasswordChange(event, vm.password)
      assert.equal(vm.passwordError, 'Password too weak')
    })
  })
  it('should reject Good password', function () {
    vm.password = 'neverforget13/3/1997'
    User.signup('test@evenset.com').then(function (data) {
      this.user = data
      assert.equal(vm.passwordError, '')
      vm.handlePasswordChange(event, vm.password)
      assert.equal(vm.passwordError, 'Password too weak')
    })
  })
  it('should accpet Strong password', function () {
    vm.password = 'briansmith4mayor'
    User.signup('test@evenset.com').then(function (data) {
      this.user = data
      assert.equal(vm.passwordError, '')
      vm.handlePasswordChange(event, vm.password)
      assert.equal(vm.passwordError, '')
    })
  })
})
