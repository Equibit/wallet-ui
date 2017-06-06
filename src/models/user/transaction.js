import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';
import $ from 'jquery';

export function generateHdNode (mnemonic) {
  let seed = bip39.mnemonicToSeed(mnemonic, '');
  let root = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet);

  return root.derivePath("m/44'/0'/0'");
}

export function getHdNode () {
  let mnemonic;
  if (!window.localStorage.getItem('test-mnemonic')) {
    mnemonic = bip39.generateMnemonic();
    window.localStorage.setItem('test-mnemonic', mnemonic);
  } else {
    console.log('Got mnemonic from cache...');
    mnemonic = window.localStorage.getItem('test-mnemonic');
  }
  return generateHdNode(mnemonic);
}

export function generateAddress (keyPair, index) {
  return keyPair.derive(index).getAddress();
}

export function getReceived (addr) {

}

export function buildTransaction (keyPair, input, output, value) {
  const tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
  tx.addInput(input, 0);
  tx.addOutput(output, value);
  tx.sign(0, keyPair);

  return tx.build().toHex();
}

export function sendBlockchainRequest (method, params = []) {
  return $.get(
    'http://localhost:3030/proxycore', {
      method,
      params
    }
  );
}
