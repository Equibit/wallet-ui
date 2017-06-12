import assert from 'chai/chai';
import 'steal-mocha';
import Session from '~/models/session';
import User from '~/models/user/user';
import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';

import './fixtures/portfolio';
import './fixtures/listunspent';

const mnemonic = 'fine raw stuff scene actor crowd flag lend wrap pony essay stamp';
const seed = bip39.mnemonicToSeed(mnemonic, '');
const hdNode = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet);

const userMock = new User({});
userMock.cacheWalletKeys(hdNode);

describe('models/session', function () {
  describe('user.set', function () {
    const session = new Session({});
    it('should populate portfolio and balance', function (done) {
      session.on('balance', function () {
        assert.equal(session.portfolios.length, 1);
        assert.equal(session.portfolios[0].keys.btc.keyPair.compressed, true);
        assert.equal(session.portfolios[0].keys.eqb.keyPair.compressed, true);
        assert.equal(session.portfolios[0].addresses.length, 2);
        assert.equal(session.portfolios[0].addressesFilled[0], 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA');
        assert.equal(session.portfolios[0].addressesFilled[1], 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo');
        assert.deepEqual(session.balance.summary.get(), {total: 4.9});
        done();
      });
      session.user = userMock;
    });
    session.on('balance', function () {});
  });
});
