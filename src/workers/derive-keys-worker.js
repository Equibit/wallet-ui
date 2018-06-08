/* global self */

import WalletCrypto from '@equibit/wallet-crypto/dist/wallet-crypto.js'
const { bitcoin } = WalletCrypto
const network = bitcoin.networks.testnet

self.onmessage = function (event) {
  switch (event.data.eventType) {
    case 'derive':
      const { base58Key, portfolioIndex = 0, coinType, isChange, keyIndex, uuid } = event.data
      const root = bitcoin.HDNode.fromBase58(base58Key, network)

      const keys = {
        BTC: root.derivePath("m/44'/0'").deriveHardened(portfolioIndex),
        EQB: root.derivePath("m/44'/73'").deriveHardened(portfolioIndex)
      }

      const hdNode = keys[coinType].derive(isChange ? 1 : 0).derive(keyIndex)

      self.postMessage({
        keyPairD: hdNode.keyPair.d.toByteArrayUnsigned(),
        keyPairNetwork: hdNode.keyPair.network,
        address: hdNode.getAddress(),
        uuid
      })
  }
}

self.postMessage({
  eventType: 'moduleReady'
})
