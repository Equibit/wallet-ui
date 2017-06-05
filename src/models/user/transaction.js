import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';
import $ from 'jquery';
// import { bip39, bitcoin } from '~/utils/crypto';

export function generateKeys (mnemonic) {
  let seed = bip39.mnemonicToSeed(mnemonic, '');
  let root = bitcoin.HDNode.fromSeedBuffer( seed, bitcoin.networks.bitcoin );

  return root.derivePath("m/44'/0'/0'");
}

export function getKeys () {
  let mnemonic;
  if (!localStorage.getItem('test-mnemonic')){
    mnemonic = bip39.generateMnemonic();
    localStorage.setItem('test-mnemonic', mnemonic);
  } else {
    console.log('Got mnemonic from cache...');
    mnemonic = localStorage.getItem('test-mnemonic');
  }
  return generateKeys (mnemonic);
}

export function generateAddress (keyPair, index) {
  return keyPair.derive(index).getAddress();
}

export function getReceived (addr) {

}

export function buildTransaction (keyPair, input, output) {
  const tx = new bitcoin.TransactionBuilder();
  tx.addInput(input, 0);
  tx.addOutput(output, 15000);
  tx.sign(0, keyPair);

  return tx.build().toHex();
}

export function sendBlockchainRequest(method, params = [], server = 'localhost:18332') {
  // --user 'equibit:equibit' -H "Content-Type: application/json"
  return $.ajax(
    'http://' + server, {
      method: 'POST',
      data: {
        method,
        params
      },
      // username: 'equibit',
      // password: 'equibit',
      headers: {
        Authorization: 'Basic ' + btoa('equibit:equibit'),
        'Content-Type': 'text/plain'
      }
    }
  );
}