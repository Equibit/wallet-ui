import fixture from 'can-fixture'
import Transaction from '../transaction'
import R from 'ramda'

const store = fixture.store(R.times(i => {
  return {
    _id: i,
    address: 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6',
    toAddress: '1BxbH4WFyN1xKDUCMQbTuQrE61dJhBV5vs',
    type: ['BUY', 'BUY', 'SELL', 'IN', 'OUT'][i % 5],
    currencyType: ['EQB', 'EQB', 'EQB', 'EQB', 'EQB', 'EQB', 'BTC'][i % 7],
    companyName: ['Imperial Brands', 'IBM', 'EQB', null, 'Marks & Spencer', 'General Electric', null ][i % 7],
    companySlug: 'imperial-brands',
    issuanceName: ['Series 1', 'Series 2', '', 'Series 1', 'Series 1', 'Series 3', ''][i % 7],
    issuanceId: '5942a4d4a33287dc13000003',
    issuanceType: ['Common Shares','Bonds', 'Equibit', 'Preferred Shares', 'Partnership Units', 'Trust Units', 'Bitcoin'][i % 7],
    issuanceUnit: ['Shares', 'BTC', null, 'Shares', 'Units', 'Units',  null][i % 7],
    txnId: '56674be22f3f85ee41ae126650c35fe74394e2c824322d72307ada7aeed2a4b5',
    amount: [1.00992837, 0.00470023][i % 2],
    amountEQB: [ 0.00987145, 3.37894092][i % 2],
    fee: 0.0000023,
    confirmations: i % 5,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    isPending: i < 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}, 10), Transaction.connection.algebra)

fixture('/transactions/{_id}', store)

export default store
