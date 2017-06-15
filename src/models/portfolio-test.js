import assert from 'chai/chai';
import 'steal-mocha';
import Portfolio, { getNextAddressIndex, getPoftfolioBalance } from './portfolio';
import hdNode from './fixtures/fixture-keys';
// import portfolioAddresses from './fixtures/portfolio-addresses';

const addressesMeta = [
  {index: 0, type: 'btc', used: true},
  {index: 1, type: 'btc', used: true},
  {index: 0, type: 'eqb', used: true},
  {index: 1, type: 'eqb', used: false}
];

const listunspent = {
  btc: {
    summary: {'total': 2},
    n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 1.5 }, // btc
    mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA: { amount: 0.5 }, // btc
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
  });

  // describe('getUnspentOutputsForAmount', function () {
  //   const portfolioAddresses = [
  //     {'type': 'btc', 'amount': 1.5}
  //   ];
  //   it('should calculate portfolio balance by addresses', function () {
  //     const addr1 = getUnspentOutputsForAmount(portfolioAddresses, 1);
  //     const addr2 = getUnspentOutputsForAmount(portfolioAddresses, 2);
  //     const addr4 = getUnspentOutputsForAmount(portfolioAddresses, 4);
  //     assert.equal(addr1, 3.7);
  //   });
  // });

  describe('instance properties', function () {
    const portfolio = new Portfolio({
      index: 0,
      addressesMeta,
      keys: portfolioKeys,
      userBalance: listunspent
    });

    it('should populate addresses', function () {
      const expectedAddresses = [
        {index: 0, type: 'btc', address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'},
        {index: 1, type: 'btc', address: 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA'},
        {index: 0, type: 'eqb', address: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'},
        {index: 1, type: 'eqb', address: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU'}
      ];
      assert.deepEqual(portfolio.addresses, expectedAddresses);
    });

    it('should populate addressesBtc and addressesEqb', function () {
      const expectedAddressesBtc = ['n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA'];
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
  });
});
