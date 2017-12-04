import crypto from '@equibit/wallet-crypto/dist/wallet-crypto'
// Ponyfill for Error.captureStackTrace which is used by typeforce.
import captureStackTrace from 'capture-stack-trace'
import typeforce from 'typeforce'

if (!Error.captureStackTrace) {
  Error.captureStackTrace = captureStackTrace
}

const bip39 = crypto.bip39
const bitcoin = crypto.bitcoin

function mnemonicToSeed (mnemonic, mnemonicPassword) {
  return bip39.mnemonicToSeed(mnemonic, mnemonicPassword)
}
function mnemonicToHDNode (mnemonic, mnemonicPassword = '') {
  let seed = mnemonicToSeed(mnemonic, mnemonicPassword)
  let network = bitcoin.networks.bitcoin
  return bitcoin.HDNode.fromSeedBuffer(seed, network)
}

function test () {
  const seed = bip39.generateMnemonic()
  const root = mnemonicToHDNode(seed)

  const rootBase58 = root.toBase58()
  console.log('toBase58: ' + rootBase58)

  let harderedPK = root.derivePath("m/44'/0")
  console.log('harderedPK ' + harderedPK.toBase58())

  let root2 = bitcoin.HDNode.fromBase58(rootBase58)
  console.log('root2', root2)

  let root3 = bitcoin.HDNode.fromBase58(harderedPK.toBase58())
  console.log('harderedPK', root3)

  const b = crypto.randomBytes(20)
  typeforce('Buffer', b)
  console.log(`randomBytes: ${b.toString('hex')}`)

  return harderedPK
}

function encrypt (stringToEncrypt, key) {
  var cipher = crypto.createCipher('aes256', key)
  return cipher.update(stringToEncrypt, 'utf8', 'hex') + cipher.final('hex')
}

function decrypt (stringToDecrypt, key) {
  var decipher = crypto.createDecipher('aes256', key)
  return decipher.update(stringToDecrypt, 'hex', 'utf8') + decipher.final('utf8')
}

export default {
  generateMnemonic: bip39.generateMnemonic,
  mnemonicToHDNode,
  mnemonicToSeed,
  test,
  encrypt,
  decrypt,
  bip39,
  bitcoin,
  randomBytes: crypto.randomBytes,
  sha256: bitcoin.crypto.sha256
}
