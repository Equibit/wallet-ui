import assert from 'chai/chai';
import 'steal-mocha';
import Portfolio, { getNextAddressIndex, getUnspentOutputsForAmount } from './portfolio';
import hdNode from './fixtures/fixture-keys';
// import portfolioAddresses from './fixtures/portfolio-addresses';
import { omit } from 'ramda';

const addressesMeta = [
  {index: 0, type: 'btc', used: true, isChange: false},
  {index: 1, type: 'btc', used: true, isChange: false},
  {index: 0, type: 'eqb', used: true, isChange: false},
  {index: 1, type: 'eqb', used: false, isChange: false},

  {index: 0, type: 'btc', used: true, isChange: true},
];

const listunspent = {
  btc: {
    summary: {'total': 2},
    n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 1.5 }, // btc
    mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA: { amount: 0.5 } // btc
  },
  eqb: {
    summary: {'total': 5.6},
    n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: { amount: 3.4 }, // eqb
    n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 2.2 }  //
  }
};

const portfolioKeys = {
  btc: hdNode.derivePath("m/44'/0'/0'"),
  eqb: hdNode.derivePath("m/44'/73'/0'")
};

describe('models/portfolio', function () {
  describe('getNextAddressIndex', function () {
    it('should return next available index', function () {
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'btc'), {index: 2, imported: false});
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'eqb'), {index: 1, imported: true});
    });
    it('should return next available index for a change address', function () {
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'btc', true), {index: 1, imported: false});
    });
  });

  describe('getUnspentOutputsForAmount', function () {
    const txouts = [
      {'amount': 1},
      {'amount': 2},
      {'amount': 3}
    ];
    it('should return the 1st tx output', function () {
      const txouts1 = getUnspentOutputsForAmount(txouts, 1);
      assert.deepEqual(txouts1, [{'amount': 1}]);
    });
    it('should return the 2nd tx output', function () {
      const txouts2 = getUnspentOutputsForAmount(txouts, 2);
      assert.deepEqual(txouts2, [{'amount': 2}]);
    });
    // TODO: optimize since having 1 and 3 is enough for 4.
    it('should return all three outputs', function () {
      const txouts3 = getUnspentOutputsForAmount(txouts, 4);
      assert.deepEqual(txouts3, [{'amount': 1}, {'amount': 2}, {'amount': 3}]);
    });
  });

  describe('instance properties', function () {
    const portfolio = new Portfolio({
      index: 0,
      addressesMeta,
      keys: portfolioKeys,
      userBalance: listunspent
    });

    it('should populate addresses', function () {
      const expectedAddresses = [
        {index: 0, type: 'btc', address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', isChange: false},
        {index: 1, type: 'btc', address: 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA', isChange: false},
        {index: 0, type: 'eqb', address: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo', isChange: false},
        {index: 1, type: 'eqb', address: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU', isChange: false},
        {index: 0, type: 'btc', address: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', isChange: true}
      ];
      assert.deepEqual(portfolio.addresses.length, 5);
      assert.deepEqual(omit(['keyPair'], portfolio.addresses[0]), expectedAddresses[0]);
    });

    it('should populate addressesBtc and addressesEqb', function () {
      const expectedAddressesBtc = ['n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA', 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ'];
      const expectedAddressesEqb = ['n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo', 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU'];
      assert.deepEqual(portfolio.addressesBtc, expectedAddressesBtc);
      assert.deepEqual(portfolio.addressesEqb, expectedAddressesEqb);
    });

    it('should populate portfolio balance based on user\'s balance', function () {
      const expectedBalance = {
        cashBtc: 2,
        cashEqb: 3.4,
        cashTotal: 5.4,
        securities: 0,
        total: 5.4,
        txouts: {eqb: [], btc: []}
      };
      assert.deepEqual(portfolio.balance.get(), expectedBalance);
    });

    it('should populate nextAddress', function () {
      const expected = {
        btc: 'mu2DDd2d9yDzS9PoqZrjD6e1ZnmgJnpv54',
        eqb: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU'
      };
      assert.deepEqual(portfolio.nextAddress, expected);
    });
  });
});
