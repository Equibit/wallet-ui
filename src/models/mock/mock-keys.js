import assert from 'chai/chai'
import { bip32, bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'
import utils from '../../utils/crypto'

const network = bitcoin.networks.testnet
const mnemonic = 'fine raw stuff scene actor crowd flag lend wrap pony essay stamp'
const seed = bip39.mnemonicToSeed(mnemonic, '')
const rootNode = bip32.fromSeed(seed, network)

// Account (Portfolio 0):
const hdNode = rootNode.derivePath(`m/44'/0'/0'`)
const xpub = hdNode.neutered().toBase58()

// Address (change=0, index=0):
const addrHdNode = hdNode.derive(0).derive(0)
const keyPair = bitcoin.ECPair.fromPrivateKey(addrHdNode.privateKey)
const address = utils.getAddress(addrHdNode.publicKey, network).address
const publicKey = addrHdNode.publicKey.toString('hex')

assert.ok(address)
assert.ok(keyPair)

export default rootNode
export {
  mnemonic,
  seed,
  hdNode,
  xpub,
  addrHdNode,
  keyPair,
  address,
  publicKey,
  network
}
