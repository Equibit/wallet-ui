const listunspent = {
  BTC: {
    summary: {'total': 2},
    n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: {
      amount: 1.5,
      txouts: [{
        'txid': 'ef26a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
        'vout': 0,
        'address': 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
        'amount': 1.5
      }]
    },
    mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA: {
      amount: 0.5,
      txouts: [{
        'txid': 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
        'vout': 0,
        'address': 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA',
        'amount': 0.5
      }]
    }
  },
  EQB: {
    summary: {'total': 5.6},
    n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: {
      amount: 3.4,
      txouts: [{
        'txid': 'e326a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
        'vout': 0,
        'address': 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo',
        'amount': 3.4
      }]
    },
    n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA: {
      amount: 2.2,
      txouts: [{
        'txid': 'e426a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301',
        'vout': 0,
        'address': 'n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
        'amount': 2.2
      }]
    }
  }
}

const listunspentZero = {
  BTC: { summary: {'total': 0} },
  EQB: { summary: {'total': 0} }
}

const listunspentBtc = {
  BTC: listunspent.BTC,
  EQB: { summary: {'total': 0} }
}

export default listunspent
export { listunspentZero }
export { listunspentBtc }
