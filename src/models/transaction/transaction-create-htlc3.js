import typeforce from 'typeforce'
import { merge } from 'ramda'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareTxData } from './transaction-create-htlc1'

/**
 * HTLC-3 collect securities using secret. Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 */
function createHtlc3 (order, offer, portfolio, issuance, secret, changeAddr) {
  typeforce(
    typeforce.tuple('Order', 'Offer', 'Issuance', 'Portfolio', 'String', types.Address),
    arguments
  )

  const htlcConfig = prepareHtlcConfig3(order, offer, portfolio, issuance, secret, changeAddr)
  // todo: generalize to both Ask and Bid.
  const tx = buildTransaction('EQB')(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout)
  const txData = prepareTxData(htlcConfig, tx, issuance)

  return txData
}

function prepareHtlcConfig3 (order, offer, portfolio, issuance, secret, changeAddr) {
  // todo: calculate transaction fee:
  const fee = 1000

  // For EQB the fee comes from empty EQB.
  const utxoEmptyEqbInfo = portfolio.getEmptyEqb(fee)
  if (!utxoEmptyEqbInfo.sum) {
    throw new Error('Not enough empty EQB to cover the fee')
  }
  const availableAmountEmptyEqb = utxoEmptyEqbInfo.sum
  const utxoEmptyEqb = utxoEmptyEqbInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))

  const buildConfig = {
    vin: [{
      txid: offer.htlcTxId2,
      vout: 0,
      keyPair: portfolio.findAddress(offer.eqbAddressTrading).keyPair,
      htlc: {
        secret,
        // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
        refundAddr: order.eqbAddressHolding,
        timelock: order.timelock || Math.floor(offer.timelock / 2)
      },
      sequence: '4294967295'
    }],
    vout: [{
      value: offer.quantity,
      address: offer.eqbAddressHolding,
      issuanceTxId: issuance.issuanceTxId
    }, {
      value: availableAmountEmptyEqb - fee,
      address: changeAddr
    }]
  }
  buildConfig.vin = buildConfig.vin.concat(utxoEmptyEqb)

  const txInfo = {
    address: offer.eqbAddressHolding,
    addressTxid: buildConfig.vin[0].txid,
    addressVout: buildConfig.vin[0].vout,
    type: 'BUY',
    currencyType: 'EQB',
    amount: offer.quantity,
    description: 'Collecting securities from HTLC',
    fromAddress: offer.eqbAddressTrading,
    toAddress: offer.eqbAddressHolding
  }
  console.log(`createHtlc3: txInfo:`, txInfo)

  return { buildConfig, txInfo }
}

export {
  createHtlc3,
  prepareHtlcConfig3
}
