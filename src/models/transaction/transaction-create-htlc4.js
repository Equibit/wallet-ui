import typeforce from 'typeforce'
import { merge } from 'ramda'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareTxData } from './transaction-create-htlc1'

/**
 * HTLC-4 collect payment using secret. Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 *
 * Case #1: Sell (Ask) Order
 * - Seller collects payment (minus fee)
 * - To: BTC
 * - From: BTC
 */
function createHtlc4 (order, offer, portfolio, issuance, secret) {
  typeforce(
    typeforce.tuple('Order', 'Offer', 'Portfolio', 'Issuance', 'String'),
    arguments
  )
  console.log(`createHtlc4 arguments:`, arguments)

  const htlcConfig = prepareHtlcConfig4(order, offer, portfolio, issuance, secret)
  // todo: generalize to both Ask and Bid.
  const tx = buildTransaction('BTC')(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout)
  const txData = prepareTxData(htlcConfig, tx, issuance)

  return txData
}

function prepareHtlcConfig4 (order, offer, portfolio, issuance, secret) {
  console.log('prepareHtlcConfig4', arguments)
  typeforce(
    typeforce.tuple('Order', 'Offer', 'Portfolio', 'Issuance', 'String'),
    arguments
  )
  // todo: calculate transaction fee:
  const fee = 1000

  const buildConfig = {
    vin: [{
      txid: offer.htlcTxId1,
      vout: 0,
      // todo: we can have a problem here with giving one BTC address to all offers.
      keyPair: portfolio.findAddress(order.btcAddress).keyPair,
      htlc: {
        secret,
        // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
        refundAddr: offer.btcAddress,
        timelock: offer.timelock
      },
      sequence: '4294967295'
    }],
    vout: [{
      value: offer.quantity * order.price - fee,
      // todo: should we send to a completely new BTC address? (e.g. multiple offers case)
      address: order.btcAddress
    }]
  }

  const txInfo = {
    address: order.btcAddress,
    addressTxid: buildConfig.vin[0].txid,
    addressVout: buildConfig.vin[0].vout,
    type: 'SELL',
    fee,
    currencyType: 'BTC',
    amount: offer.quantity * order.price,
    description: 'Collecting payment from HTLC',
    fromAddress: offer.btcAddress,
    toAddress: order.btcAddress
  }
  console.log(`createHtlc3: txInfo:`, txInfo)

  return { buildConfig, txInfo }
}

export {
  createHtlc4,
  prepareHtlcConfig4
}
