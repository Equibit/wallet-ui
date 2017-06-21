import Portfolio from '../portfolio';
import hdNode from './mock-keys';

const addressesMeta = [
  {index: 0, type: 'BTC', used: true, isChange: false},
  {index: 1, type: 'BTC', used: true, isChange: false},
  {index: 0, type: 'EQB', used: true, isChange: false},
  {index: 1, type: 'EQB', used: false, isChange: false},

  {index: 0, type: 'BTC', used: true, isChange: true}
];

const listunspent = {
  BTC: {
    summary: {'total': 2},
    n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 1.5 }, // BTC
    mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA: { amount: 0.5 } // BTC
  },
  EQB: {
    summary: {'total': 5.6},
    n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: { amount: 3.4 }, // EQB
    n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 2.2 }  //
  }
};

const portfolioKeys = {
  BTC: hdNode.derivePath("m/44'/0'/0'"),
  EQB: hdNode.derivePath("m/44'/73'/0'")
};

const portfolio = new Portfolio({
  index: 0,
  addressesMeta,
  keys: portfolioKeys,
  userBalance: listunspent
});

export default portfolio;
export { addressesMeta };
