import { bitcoin, bip39 } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { translate } from '../i18n/i18n'

const emailRegex = /.+@.+\..+/i
const emailRegexPlus = /.+(\+\d+)@.+\..+/i

export default {
  email (value, { allowEmpty }) {
    return (!allowEmpty && !value && 'Email is missing') ||
      (value && !emailRegex.test(value) && 'Enter a valid email address') ||
      (value && emailRegexPlus.test(value) && 'Enter a valid email address') || ''
  },
  password (value, { allowEmpty }) {
    return (!allowEmpty && !value && 'Password is missing') || ''
  },
  terms (value) {
    return (!value && 'You need to read and agree to our Terms & Conditions and Privacy Policy') || ''
  },
  bitcoinAddress (string) {
    if (!string) {
      return ''
    }
    try {
      bitcoin.address.fromBase58Check(string)
    } catch (e) {
      return 'Invalid address'
    }
    return ''
  },
  mnemonic (value) {
    if (!value) {
      return ''
    }
    if (value.trim().split(/\s+/g).length < 12) {
      return translate('validationMnemonicTooShort')
    }
    return bip39.validateMnemonic(value) ? '' : translate('validationMnemonicInvalidChecksum')
  }
}
