// Note: the addresses are derived from the mock-keys by their indexes. Do not change them.

const listunspent = {
  BTC: {
    summary: {'total': 210000000},
    addresses: {
      n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: {
        amount: 150000000,
        txouts: [{
          'txid': 'ef26a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
          'amount': 150000000
        }]
      },
      mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA: {
        amount: 50000000,
        txouts: [{
          'txid': 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA',
          'amount': 50000000
        }]
      },
      mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ: {
        amount: 10000000,
        txouts: [{
          'txid': 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 1,
          'address': 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ',
          'amount': 10000000
        }]
      }
    }
  },
  EQB: {
    summary: {'total': 560000000},
    addresses: {
      n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: {
        amount: 340000000,
        txouts: [{
          'txid': 'e326a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo',
          'amount': 340000000,
          'equibit': {
            'payment_currency': 0,
            'payment_tx_id': '',
            'issuance_tx_id': '0000000000000000000000000000000000000000000000000000000000000000',
            'issuance_json': ''
          }
        }]
      },
      mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU: {
        amount: 220000000,
        txouts: [{
          'txid': 'e426a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU',
          'amount': 220000000,
          'equibit': {
            'payment_currency': 0,
            'payment_tx_id': 'a34f6c88e534fbbb00357f8bbbaf15dad9b34a20a837b510ef4b4a08cf72333b',
            'issuance_tx_id': 'e8d9a1f6fb447f4db49778a65af6c93fc019eb2b5c0fd338835a56e2136ade82',
            'issuance_json': ''
          }
        }]
      }
    }
  }
}

const listunspentZero = {
  BTC: { summary: {'total': 0}, addresses: {} },
  EQB: { summary: {'total': 0}, addresses: {} }
}

const listunspentBtc = {
  BTC: listunspent.BTC,
  EQB: { summary: {'total': 0}, addresses: {} }
}

export default listunspent
export { listunspentZero }
export { listunspentBtc }
