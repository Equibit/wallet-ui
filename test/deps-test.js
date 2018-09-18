import assert from 'chai/chai'
import 'steal-mocha'
import walletCrypto from '@equibit/wallet-crypto/dist/wallet-crypto'

describe('dependencies', function () {
  describe('wallet-crypto', function () {
    it('should export bip32 ', function () {
      assert.equal(typeof walletCrypto.bip32, 'object')
    })
    it('should export bip39 ', function () {
      assert.equal(typeof walletCrypto.bip39, 'object')
    })
    describe('bitcoinjs-lib', function () {
      const ECPair = walletCrypto.bitcoin.ECPair
      it('should NOT contain HDNode', function () {
        assert.equal(typeof walletCrypto.bitcoin.HDNode, 'undefined')
      })
      it('should contain payments module', function () {
        assert.equal(typeof walletCrypto.bitcoin.payments, 'object')
      })
      it('should be able to get BigInteger constructor from ECPair private prop', function () {
        const BigInteger = ECPair.makeRandom().__d.constructor
        assert.equal(typeof BigInteger, 'function')
      })
      it('should be able to get privateKey byte array from ECPair', function () {
        assert.equal(typeof ECPair.makeRandom().privateKey, 'object')
      })
    })
  })
})
