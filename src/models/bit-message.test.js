import assert from 'chai/chai'
import 'steal-mocha'
import { walletMessage, eqbTxBuilder } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { keyPair, publicKey } from './mock/mock-keys'
import BitMessage from './bit-message'

const getHash = eqbTxBuilder.getTxId

describe('BitMessage', function () {
  const messageData = {
    'type': 'Bid',
    'timestamp': 1508336182,
    'timestamp_nanoseconds': 0,
    'sender_public_key': publicKey,
    'payload': '{"quantity": 25000,"price": "44.15","fill_or_kill": "no","duration": 172800}'
  }

  describe('wallet-crypto/messagePow', function () {
    const message = walletMessage.messagePow(messageData, keyPair, 4)
    console.log(`message = ${message.toString('hex')}`)

    it('should build signed message with a nonce', function () {
      assert.ok(message.toString('hex'))
    })

    it('should be decoded with the correct data', function () {
      const [decoded, leftBuffer] = walletMessage.decoder.decodeMessage(message)
      assert.equal(decoded.type, messageData.type)
      assert.equal(leftBuffer.length, 0)
    })

    it('should have hash with difficulty 4', function () {
      const hash = getHash(message)
      assert.equal(hash.slice(0, 4), '0000')
    })
  })

  describe('models/bit-message', function () {
    describe.skip('createFromOrder', function () {})
    describe('build', function () {
      const bitMessage = new BitMessage(messageData)
      it('should build a message', function () {
        const message = bitMessage.build(keyPair)
        const hash = getHash(message)
        assert.equal(hash.slice(0, 4), '0000')
      })
    })
  })
})
