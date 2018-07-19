import 'steal-mocha'
import assert from 'chai/chai'
import { ViewModel } from './recovery-phrase'
import { mnemonic } from '../../../models/mock/mock-keys'
import { translate } from '../../../i18n/i18n'
import route from 'can-route'

// ViewModel unit tests
describe('wallet-ui/components/page-auth/recovery-phrase/', () => {
  let vm, routeOrig, verifyMnemonicHashCalled, generateKeysAndPatchUserCalled
  beforeEach(function () {
    vm = new ViewModel({
      user: {
        verifyMnemonicHash (val) {
          verifyMnemonicHashCalled = true
          return val === mnemonic ? Promise.resolve(true) : Promise.reject(new Error('validationMnemonicWrong'))
        },
        generateKeysAndPatchUser () {
          generateKeysAndPatchUserCalled = true
          return Promise.resolve(true)
        }
      }
    })
    routeOrig = route.data.page
  })
  afterEach(function () {
    route.data.page = routeOrig
    verifyMnemonicHashCalled = false
    generateKeysAndPatchUserCalled = false
  })
  describe('verifyMnemonic', function () {
    it('should verify a correct mnemonic', function () {
      vm.mnemonic = mnemonic
      return vm.verifyMnemonic().then(() => {
        assert.equal(vm.error, undefined, 'no error')
        assert.ok(verifyMnemonicHashCalled)
        assert.ok(generateKeysAndPatchUserCalled)
      })
    })
    it('should navigate to change-password', function () {
      vm.mnemonic = mnemonic
      assert.equal(route.data.page, routeOrig)
      return vm.verifyMnemonic().then(() => {
        assert.equal(route.data.page, 'change-password')
      })
    })
    it('should show error `validationMnemonicWrong` for a wrong mnemonic', function () {
      const words = mnemonic.split(' ')
      words.pop()
      words.push(words[0])
      vm.mnemonic = words.join(' ')
      return vm.verifyMnemonic().then(() => {
        assert.equal(vm.error, translate('validationMnemonicWrong'))
      })
    })
  })
})
