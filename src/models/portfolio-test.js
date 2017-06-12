import assert from 'chai/chai';
import 'steal-mocha';
import Portfolio, { getNextAddressIndex, getPoftfolioBalance } from './portfolio';
import hdNode from './fixtures/fixture-keys';

const addresses = [
  {index: 0, type: 'btc', used: true},
  {index: 1, type: 'btc', used: true},
  {index: 0, type: 'eqb', used: true},
  {index: 1, type: 'eqb', used: false}
];

const listunspent = {
  summary: {'total': 4.9},
  n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 1.5 },
  n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: { amount: 3.4 },
  n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 2.2 }
};

const portfolioKeys = {
  btc: hdNode.derivePath("m/44'/0'/0'"),
  eqb: hdNode.derivePath("m/44'/73'/0'")
};


describe('models/portfolio', function () {
  describe('getNextAddressIndex', function () {
    it('should return next available index', function () {
      assert.deepEqual(getNextAddressIndex(addresses, 'btc'), {index: 2, imported: false});
      assert.deepEqual(getNextAddressIndex(addresses, 'eqb'), {index: 1, imported: true});
    });
  });

  describe('getPoftfolioBalance', function () {
    const portfolioAddresses = ['n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'empty'];
    it('should calculate portfolio balance by addresses', function () {
      assert.equal(getPoftfolioBalance(listunspent, portfolioAddresses), 3.7);
    });
  });

  describe('instance properties', function () {
    const portfolio = new Portfolio({
      index: 0,
      addresses,
      keys: portfolioKeys,
      userBalance: listunspent
    });

    it('should populate addressesFilled', function () {
      const expectedAddressesFilled = [
        {index: 0, type: 'btc', address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'},
        {index: 1, type: 'btc', address: 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA'},
        {index: 0, type: 'eqb', address: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'},
        {index: 1, type: 'eqb', address: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU'},
      ];
      console.log(portfolio.addressesFilled.get());
      assert.deepEqual(portfolio.addressesFilled.get(), expectedAddressesFilled);
    });

    it('should populate addressesList', function () {
      const expectedAddressList = [
        'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
        'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA',
        'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo',
        'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU'
      ];
      assert.deepEqual(portfolio.addressesList.get(), expectedAddressList);
    });
  });
});
