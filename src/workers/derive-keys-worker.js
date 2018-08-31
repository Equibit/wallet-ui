/* global self */

import WalletCrypto from '@equibit/wallet-crypto/dist/wallet-crypto.js'
import cryptoUtils from '../utils/crypto'
const { bitcoin, bip32 } = WalletCrypto
const { getAddress } = cryptoUtils
// TODO: retrieve network from blockchain-info service.
const network = bitcoin.networks.testnet

self.onmessage = function (event) {
  switch (event.data.eventType) {
    case 'derive':
      const { base58Key, portfolioIndex = 0, coinType, isChange, keyIndex, uuid } = event.data
      const root = bip32.fromBase58(base58Key, network)

      const keys = {
        BTC: root.derivePath("m/44'/0'").deriveHardened(portfolioIndex),
        EQB: root.derivePath("m/44'/73'").deriveHardened(portfolioIndex)
      }

      const hdNode = keys[coinType].derive(isChange ? 1 : 0).derive(keyIndex)
      const keyPair = bitcoin.ECPair.fromPrivateKey(hdNode.privateKey, {network: hdNode.network})

      self.postMessage({
        keyPairD: keyPair.privateKey,
        keyPairNetwork: hdNode.network,
        address: getAddress(hdNode.publicKey, hdNode.network),
        uuid
      })
  }
}

self.postMessage({
  eventType: 'moduleReady'
})
