import fixture from 'can-fixture';
import Transaction from '../transaction';
import R from 'ramda';

const store = fixture.store(R.times(i => {
  return {
    _id: i,
    address: 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6',
    toAddress: '1BxbH4WFyN1xKDUCMQbTuQrE61dJhBV5vs',
    type: ['SEND', 'BUY', 'RECEIVE', 'SELL'][i % 4],
    currencyType: ['BTC', 'EQB'][i % 2],
    companyName: ['', 'IBM'][i % 2],
    issuanceName: ['', 'Series 1'][i % 2],
    txnId: '56674be22f3f85ee41ae126650c35fe74394e2c824322d72307ada7aeed2a4b5',
    amount: [15, 25][i % 2],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    isPending: i % 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}, 4), Transaction.connection.algebra);

fixture('/transactions/{_id}', store);

export default store;
