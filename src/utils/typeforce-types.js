import typeforce from 'typeforce'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'

const txIdRe = /[\w]{32}/

const instanceOf = function (ConstructorFn) {
  return function instanceOf (value) {
    return value instanceof ConstructorFn
  }
}

// Transaction ID is a 256 bit hex value:
const TxId = function (value) {
  // String of 64 chars (which is 32 bytes in hex, which is 256 bits):
  return txIdRe.test(value)
}

const BlockchainInfoBySymbol = typeforce.compile({
  BTC: { network: types.Network, sha: '?String' },
  EQB: { network: types.Network, sha: '?String' }
})

export {
  instanceOf,
  TxId,
  BlockchainInfoBySymbol
}
