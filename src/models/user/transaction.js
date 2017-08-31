import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'
import $ from 'jquery'

export function generateHdNode (mnemonic) {
  let seed = bip39.mnemonicToSeed(mnemonic, '')
  let root = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet)

  return root.derivePath("m/44'/0'/0'")
}

export function getHdNode (name) {
  let mnemonic
  if (!window.localStorage.getItem('test-mnemonic-' + name)) {
    mnemonic = bip39.generateMnemonic()
    window.localStorage.setItem('test-mnemonic-' + name, mnemonic)
  } else {
    console.log('Got mnemonic from cache...')
    mnemonic = window.localStorage.getItem('test-mnemonic-' + name)
  }
  return generateHdNode(mnemonic)
}

// m / purpose' / coin_type' / account' / change / address_index

// "m/44'/0'/0'"  ->  "m/44'/0'/0'/0/index"
export function generateAddress (hdNode, index) {
  // change = 0,  external chain
  const addrhdNode = hdNode.derive(0).derive(index)
  const address = addrhdNode.getAddress()
  return {
    address,
    hdNode: addrhdNode
  }
}

export function getReceived (addr) {

}

export function buildTransaction (keyPair, inputId, inputIndex, outputs) {
  const tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
  tx.addInput(inputId, inputIndex)
  outputs.forEach(([output, value]) => tx.addOutput(output, value))
  tx.sign(0, keyPair)
  debugger

  return tx.build().toHex()
}

export function sendBlockchainRequest (method, params = []) {
  return $.get(
    'http://localhost:3030/proxycore', {
      method,
      params
    }
  )
}
