import fixture from 'can-fixture';
import Transaction from '../transaction';
import R from 'ramda';

const store = fixture.store(R.times(i => {
  return {
    _id: i,
    address: '234',
    toAddress: '456',
    type: ['SEND', 'BUY', 'RECEIVE', 'SELL'][i % 4],
    currencyType: ['BTC', 'EQB'][i % 2],
    companyName: ['', 'IBM'][i % 2],
    issuanceName: ['', 'Series 1'][i % 2],
    txnId: '123',
    amount: [15, 25][i % 2],
    description: 'Test',
    isPending: i % 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}, 4), Transaction.connection.algebra);

fixture('/transactions/{_id}', store);

export default store;
