import 'steal-mocha'
import assert from 'chai/chai'
import { ViewModel } from './recovery-phrase'
import mockUser from '../../../models/mock/mock-user'
import { mnemonic } from '../../../models/mock/mock-keys'
import { translate } from '../../../i18n/i18n'
import route from 'can-route'

// ViewModel unit tests
describe('wallet-ui/components/page-auth/recovery-phrase/', () => {
  let vm, routeOrig
  beforeEach(function () {
    vm = new ViewModel({
      user: mockUser
    })
    routeOrig = route.data.page
  })
  afterEach(function () {
    route.data.page = routeOrig
  })
  describe('verifyMnemonic', function () {
    it('should verify a correct mnemonic', function () {
      vm.mnemonic = mnemonic
      vm.verifyMnemonic()
      assert.equal(vm.error, undefined, 'no error')
    })
    it('should navigate to portfolio', function () {
      vm.mnemonic = mnemonic
      assert.equal(route.data.page, routeOrig)
      vm.verifyMnemonic()
      assert.equal(route.data.page, 'portfolio')
    })
    it('should show error `validationMnemonicWrong` for a wrong mnemonic', function () {
      const words = mnemonic.split(' ')
      words.pop()
      words.push(words[0])
      vm.mnemonic = words.join(' ')
      vm.verifyMnemonic()
      assert.equal(vm.error, translate('validationMnemonicWrong'))
    })
  })
})
