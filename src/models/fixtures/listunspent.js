import fixture from 'can-fixture';

fixture('GET /listunspent', function () {
  return {
    btc: {
      summary: {'total': 1.5},
      n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: {
        amount: 1.5,
        txouts: [{
          txid: '50096d2b246c260698b949ce7cd321bd231e23975a9f7603b1a859d4c5906bae',
          vout: 1,
          address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
          account: '',
          scriptPubKey: '76a91432603c646ac065369204cbfb4ab0839b18a1812988ac',
          amount: 1.5,
          confirmations: 0,
          spendable: false,
          solvable: false
        }]
      }
    },
    eqb: {
      summary: {
        total: 3.4
      },
      n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: {
        amount: 3.4,
        txouts: [{
          txid: '2f3caaca755707ef3cb846cca5a0b536d4afaf551a7fc3edbd007a77df84b4cb',
          vout: 1,
          address: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo',
          account: '',
          scriptPubKey: '76a9140f1492371896d79aaf929f411e6c2313abb70b3888ac',
          amount: 3.4,
          confirmations: 0,
          spendable: false,
          solvable: false
        }]
      }
    },
  };
});
