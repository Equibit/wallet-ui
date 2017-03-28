import { bip39 } from '@equibit/wallet-crypto/dist/wallet-crypto';
import { Bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';

function mnemonicToSeed (mnemonic, mnemonicPassword) {
  return bip39.mnemonicToSeed(mnemonic, mnemonicPassword);
}
function mnemonicToPrivateKey (mnemonic, mnemonicPassword='') {
  let seed = mnemonicToSeed(mnemonic, mnemonicPassword);
  let network = Bitcoin.networks.bitcoin;
  return Bitcoin.HDNode.fromSeedBuffer(seed, network);
}
function getPublicKey (privateKey) {

}

export default {
  generateMnemonic: bip39.generateMnemonic,
  mnemonicToPrivateKey,
  mnemonicToSeed,
  getPublicKey
};