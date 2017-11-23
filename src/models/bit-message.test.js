import assert from 'chai/chai'
import 'steal-mocha'
import { walletMessage, eqbTxBuilder } from '@equibit/wallet-crypto'
import { keyPair, publicKey } from './mock/mock-keys'
import BitMessage from './bit-message'
import Order from './order'

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
    const message = walletMessage.messagePow(messageData, keyPair, 2)
    // console.log(`message = ${message.toString('hex')}`)

    it('should build signed message with a nonce', function () {
      assert.ok(message.toString('hex'))
    })

    it('should be decoded with the correct data', function () {
      const [decoded, leftBuffer] = walletMessage.decoder.decodeMessage(message)
      assert.equal(decoded.type, messageData.type)
      assert.equal(leftBuffer.length, 0)
    })

    it('should have hash with difficulty 2', function () {
      const hash = getHash(message)
      assert.equal(hash.slice(0, 2), '00')
    })
  })

  describe('models/bit-message', function () {
    describe('createFromOrder', function () {
      const order = new Order({
        type: 'SELL',
        quantity: 100,
        price: 50,
        duration: 10000
      })
      const bitMessage = BitMessage.createFromOrder(order, keyPair)
      it('should build a message from order', function () {
        const message = bitMessage.build(2)
        const hash = getHash(message)
        assert.equal(hash.slice(0, 2), '00')
      })
    })
    describe('build', function () {
      const bitMessage = new BitMessage(messageData)
      bitMessage.keyPair = keyPair
      it('should build a message', function () {
        const message = bitMessage.build(2)
        const hash = getHash(message)
        assert.equal(hash.slice(0, 2), '00')
      })
    })
  })
})
