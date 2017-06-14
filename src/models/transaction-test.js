import assert from 'chai/chai';
import 'steal-mocha';
import { buildTransaction } from '~/models/transaction';
import { bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';

import './fixtures/portfolio';
import './fixtures/listunspent';
import hdNode from './fixtures/fixture-keys';

describe('models/transaction', function () {
  describe('buildTransaction', function () {
    const expectedHex = '0100000002b5a4d2ee7ada7a30722d3224c8e29443e75fc3506612ae41ee853f2fe24b6756000000006b483045022100c5d7e56232d2eff6461ea45bb8e9ffee36675598adb853bf6f61e881b2c29282022000d4f1d3c3e091daa4dbece16fb1f27ee199fdbd2db4db940b9a4b6987e24ed6012102c149f0b80bbbb0811cd7f2d8c2eed5bae28de5e992064590a0a16eb1743bc469ffffffff79ea8eea8ee96dc748304f5d85163d28bfcc0f9760ee50e02664b6b52dd9da1e000000006b483045022100861ac9755c989a65726a1dbf46bf85dcf12928fc5f4bc42fede7142af4111fd30220385336eed4e26c52c605a18a60effee88bfc9d0306b09994dd85bf48607762f50121028fe426abec4cd47b05911e18e91cd751a1646d179217380e7799cd12268bf202ffffffff0201000000000000001976a9143ed6bbf121b09f20b46381ab7dbf547e18ffbc3b88ac02000000000000001976a914af407ff486847db48b9a2cb25b6e14d3044eaf4488ac00000000';
    it('should create a transaction hex', function () {
      const inputA = hdNode.derive(0);
      const inputB = hdNode.derive(1);
      const inputs = [
        {txid: '56674be22f3f85ee41ae126650c35fe74394e2c824322d72307ada7aeed2a4b5', vout: 0, keyPair: inputA.keyPair},
        {txid: '1edad92db5b66426e050ee60970fccbf283d16855d4f3048c76de98eea8eea79', vout: 0, keyPair: inputB.keyPair}
      ];
      const outputs = [
        {address: 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6', value: 1},
        {address: 'mwVbp9hMyfvnjW3sEbyfgLqiGd4wMxbekh', value: 2}
      ];
      const transactionHex = buildTransaction(inputs, outputs, bitcoin.networks.testnet);
      assert.equal(transactionHex, expectedHex);
    });
  });
});
