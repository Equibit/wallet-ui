/*
 * const { messagePow } = require('../dist/wallet-message')
 * const fixtureNode = require('../test/fixtures/hdnode.build')
 * const keyPair = fixtureNode.keyPair
 * const publicKey = fixtureNode.publicKey
 *
 * const messageData = {
 *  'type': 'Bid',
 *  'timestamp': 1508263808,
 *  'timestamp_nanoseconds': 442996818,
 *  'sender_public_key': publicKey,
 *  'payload': '{"quantity": 5000,"price": "0.333","fill_or_kill": "no","duration": 86400}'
 * }
 *
 * const message = messagePow(messageData, keyPair, 4)
 * console.log(`message = ${message.toString('hex')}`, messageData)
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import { walletMessage } from '@equibit/wallet-crypto/dist/wallet-crypto'

// feathersClient.service('/bit-message')

const BitMessage = DefineMap.extend('BitMessage', {
  createFrom (item, keyPair, publicKey) {
    const time = '' + Date.now()
    return new BitMessage({
      type: item.type === 'SELL' ? 'Ask' : 'Bid',
      timestamp: Number(time.slice(0, -3)),
      timestamp_nanoseconds: Number(time.slice(0, -3)) * 1000,
      payload: JSON.stringify(item.getMessagePayload()),
      sender_public_key: publicKey,
      keyPair
    })
  }
}, {
  _id: 'string',
  // ENUM ['Bid', 'Ask']
  type: 'string',
  // In seconds:
  timestamp: 'number',
  // Extra precision in nanoseconds:
  timestamp_nanoseconds: 'number',
  sender_public_key: 'string',
  payload: 'string',
  keyPair: 'string',

  build (keyPair = this.keyPair, difficulty = 4) {
    const message = walletMessage.messagePow(this.serialize(), keyPair, difficulty)
    console.log(`BitMessage.build: message=${message}`)
    return message
  },

  send (message = this.build()) {
    return sendMessage(message)
  }
})

const sendMessage = (message) => {
  return feathersClient.service('proxycore').find({
    query: {
      node: 'equibit',
      method: 'sendrawmessage',
      params: [ message ]
    }
  }).then(res => {
    if (!res.error) {
      console.log('The message was sent successfully', res)
    } else {
      console.error('There was an error when we tried to send your message: ', res)
    }
  })
}

BitMessage.List = DefineList.extend('BitMessageList', {
  '#': BitMessage
})

export default BitMessage
