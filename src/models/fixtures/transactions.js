import fixture from 'can-fixture';

const store = fixture.store([{
  _id: 1,
  address: '234',
  toAddress: '456',
  type: 'SEND', // enum: [ 'SEND', 'RECEIVE', 'BUY', 'SELL' ]
  currencyType: 'BTC', // enum: [ 'BTC', 'EQB' ]
  companyName: 'Expedian plc',
  issuanceName: 'string',
  txnId: '123',
  amount: 10,
  description: 'Test',
  createdAt: Date.now(),
  updatedAt: Date.now()
}], User.connection.algebra);

fixture('/transactions/{_id}', store);

export default store;
