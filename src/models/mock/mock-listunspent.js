// Note: the addresses are derived from the mock-keys by their indexes. Do not change them.

const listunspent = {
  BTC: {
    summary: {'total': 2.1 * 100000000},
    addresses: {
      n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: {
        amount: 1.5 * 100000000,
        txouts: [{
          'txid': 'ef26a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
          'amount': 1.5 * 100000000
        }]
      },
      mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA: {
        amount: 0.5 * 100000000,
        txouts: [{
          'txid': 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA',
          'amount': 0.5 * 100000000
        }]
      },
      mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ: {
        amount: 0.1 * 100000000,
        txouts: [{
          'txid': 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 1,
          'address': 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ',
          'amount': 0.1 * 100000000
        }]
      }
    }
  },
  EQB: {
    summary: {'total': 5.6 * 100000000},
    addresses: {
      n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: {
        amount: 3.4 * 100000000,
        txouts: [{
          'txid': 'e326a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo',
          'amount': 3.4 * 100000000
        }]
      },
      mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU: {
        amount: 2.2 * 100000000,
        txouts: [{
          'txid': 'e426a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
          'vout': 0,
          'address': 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU',
          'amount': 2.2 * 100000000
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
  // EQB: { summary: {'total': 0}, addresses: {} }
  EQB: listunspent.EQB
}

export default listunspent
export { listunspentZero }
export { listunspentBtc }
