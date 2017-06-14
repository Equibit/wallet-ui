import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

const Transaction = DefineMap.extend('Transaction', {
  _id: 'string',
  address: 'string',
  type: 'string', // enum: [ 'BTC', 'EQB' ]
  companyName: 'string',
  issuanceName: 'string',
  txnId: 'string',
  amount: 'number',
  description: 'string',
  hex: 'string',
  createdAt: { type: 'date', serialize: false },
  updatedAt: { type: 'date', serialize: false },
  buildTransaction (data, balance, keys) {

  }
});

Transaction.List = DefineList.extend('TransactionList', {
  '#': Transaction
});

Transaction.connection = superModel({
  Map: Transaction,
  List: Transaction.List,
  feathersService: feathersClient.service('/transactions'),
  name: 'transactions',
  algebra
});

Transaction.algebra = algebra;

export default Transaction;
