import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'

const mnemonic = 'fine raw stuff scene actor crowd flag lend wrap pony essay stamp'
const seed = bip39.mnemonicToSeed(mnemonic, '')
const rootNode = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet)

// Account (Portfolio 0):
const hdNode = rootNode.derivePath(`m/44'/0'/0'`)
const xpub = hdNode.neutered().toBase58()

// Address (change=0, index=0):
const addrHdNode = hdNode.derive(0).derive(0)
const keyPair = addrHdNode.keyPair
const address = addrHdNode.getAddress()
const publicKey = addrHdNode.getPublicKeyBuffer().toString('hex')

export default rootNode
export {
  mnemonic,
  seed,
  hdNode,
  xpub,
  addrHdNode,
  keyPair,
  address,
  publicKey
}
