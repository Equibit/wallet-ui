import chai from 'chai'
import { translate } from '../i18n/i18n'
import { toMaxPrecision } from './formatter'
import validators from './validators'
import '../models/mock/mock-session'

// import './random-elements-test'

const assert = chai.assert

describe('utils/formatter', function () {
  it('should format to max precision of 8', function () {
    assert.equal(toMaxPrecision(1.123456789, 8), 1.12345679)
    assert.equal(toMaxPrecision(1.123456789, 8).toString(), '1.12345679')
  })
  it('should not add extra zeros', function () {
    assert.equal(toMaxPrecision(1.12345, 8).toString(), '1.12345')
  })
})

describe('utils/validators', function () {
  describe('bitcoinAddress', function () {
    it('should validate bitcoin address', function () {
      assert.equal(validators.bitcoinAddress('mgth5EtV5wStzrY9ozFsuHChpbMBbK4ZHm'), '')
    })
    it('should invalidate an invalid bitcoin address', function () {
      assert.equal(validators.bitcoinAddress(123), 'Invalid address')
    })
  })
  describe('mnemonic', function () {
    it('should validate mnemonic', function () {
      assert.equal(validators.mnemonic('element parade shine citizen carry fold body pet jar sword salon absent'), '')
    })
    it('should invalidate a short mnemonic', function () {
      assert.equal(validators.mnemonic('element parade shine citizen'), translate('validationMnemonicTooShort'))
    })
    it('should invalidate a long mnemonic', function () {
      assert.equal(validators.mnemonic('element parade shine citizen carry fold body pet jar sword salon absent wrong'), translate('validationMnemonicInvalidChecksum'))
    })
  })
})
