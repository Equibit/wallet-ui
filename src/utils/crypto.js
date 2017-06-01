import crypto from '@equibit/wallet-crypto/dist/wallet-crypto';
import bip39 from 'bip39';
import bitcoin from 'bitcoinjs-lib';

function mnemonicToSeed (mnemonic, mnemonicPassword) {
  return bip39.mnemonicToSeed(mnemonic, mnemonicPassword);
}
function mnemonicToPrivateKey (mnemonic, mnemonicPassword = '') {
  let seed = mnemonicToSeed(mnemonic, mnemonicPassword);
  let network = bitcoin.networks.bitcoin;
  return bitcoin.HDNode.fromSeedBuffer(seed, network);
}
function getPublicKey (privateKey) {

}

export default {
  generateMnemonic: bip39.generateMnemonic,
  mnemonicToPrivateKey,
  mnemonicToSeed,
  getPublicKey,
};
