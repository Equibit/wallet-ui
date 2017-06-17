import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';
import { bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';
import { pick } from 'ramda';

const Transaction = DefineMap.extend('Transaction', {
  makeTransaction (amount, toAddress, txouts, {fee, changeAddr, network}) {
    const inputs = txouts.map(pick(['txid', 'vout', 'keyPair']));
    const availableAmount = txouts.reduce((acc, a) => acc + a.amount, 0);
    const outputs = [
      {address: changeAddr, value: amount},
      {address: toAddress, value: availableAmount - amount - fee}
    ];
    const hex = buildTransaction(inputs, outputs, network);
    console.log('hex = ' + hex);
  }
}, {
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
  updatedAt: { type: 'date', serialize: false }
});

/**
 * @function buildTransaction
 * Builds a signed transaction.
 *
 * @param {Array<Object(txid, vout, keyPair)>} inputs
 * @param {Array<Object(address, value)>} outputs
 * @returns {String} A HEX code of the signed transaction
 */
export function buildTransaction (inputs, outputs, network = bitcoin.networks.testnet) {
  const tx = new bitcoin.TransactionBuilder(network);
  inputs.forEach(({ txid, vout }, index) => tx.addInput(txid, vout));
  outputs.forEach(({address, value}) => tx.addOutput(address, value));
  inputs.forEach(({ keyPair }, index) => tx.sign(index, keyPair));
  return tx.build().toHex();
}

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
