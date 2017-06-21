import Portfolio from '../portfolio';
import hdNode from './mock-keys';

const addressesMeta = [
  {index: 0, type: 'btc', used: true, isChange: false},
  {index: 1, type: 'btc', used: true, isChange: false},
  {index: 0, type: 'eqb', used: true, isChange: false},
  {index: 1, type: 'eqb', used: false, isChange: false},

  {index: 0, type: 'btc', used: true, isChange: true}
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

const portfolio = new Portfolio({
  index: 0,
  addressesMeta,
  keys: portfolioKeys,
  userBalance: listunspent
});

export default portfolio;
export { addressesMeta };
