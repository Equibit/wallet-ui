import crypto from '@equibit/wallet-crypto/dist/wallet-crypto';
const bip39 = crypto.bip39;
const bitcoin = crypto.bitcoin;

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
  getPublicKey
};
