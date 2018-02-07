import typeforce from 'typeforce'
import { merge } from 'ramda'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareTxData } from './transaction-create-htlc1'

/**
 * HTLC-3 collect securities using secret. Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 *
 * Case #1: Sell (Ask) Order
 * - Buyer collects securities
 * - To: EQB holding address (offer)
 * - From: EQB holding address (order)
 * Case #2: Buy (Bid) Order
 * - Buyer collects payment
 */
function createHtlc3 (order, offer, portfolio, issuance, secret, changeAddr) {
  typeforce(
    typeforce.tuple('Order', 'Offer', 'Portfolio', 'Issuance', 'String', types.Address),
    arguments
  )
  console.log(`createHtlc3 arguments:`, arguments)
  const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'

  const htlcConfig = currencyType === 'EQB'
    ? prepareHtlcConfig3(order, offer, portfolio, issuance, secret, changeAddr)
    : prepareHtlcConfig3Btc(order, offer, portfolio, secret, changeAddr)
  const tx = buildTransaction(currencyType)(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout)
  const txData = prepareTxData(htlcConfig, tx, issuance)

  return txData
}

function prepareHtlcConfig3 (order, offer, portfolio, issuance, secret, changeAddr) {
  const amount = offer.quantity
  const toAddress = offer.eqbAddress
  const refundAddr = order.eqbAddress
  typeforce(types.Address, toAddress)
  typeforce(types.Address, refundAddr)

  // todo: calculate transaction fee:
  const fee = 1000
  const htlcStep = 3
  const timelock = order.type === 'SELL' ? offer.timelock2 : offer.timelock

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
      // Main input of the locked HTLC amount:
      txid: offer.htlcTxId2,
      vout: 0,
      keyPair: portfolio.findAddress(offer.eqbAddress).keyPair,
      htlc: {
        secret,
        // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
        refundAddr,
        timelock: timelock
      },
      sequence: '4294967295'
    }],
    vout: [{
      // Main output (unlocking HTLC securities):
      value: amount,
      address: toAddress,
      issuanceTxId: issuance.issuanceTxId
    }, {
      // Regular change output:
      value: availableAmountEmptyEqb - fee,
      address: changeAddr
    }]
  }
  buildConfig.vin = buildConfig.vin.concat(utxoEmptyEqb)

  const txInfo = {
    address: toAddress,
    addressTxid: buildConfig.vin[0].txid,
    addressVout: buildConfig.vin[0].vout,
    type: 'BUY',
    fee,
    currencyType: 'EQB',
    amount,
    description: `Collecting securities from HTLC (step #${htlcStep})`,
    fromAddress: order.eqbAddress,
    toAddress,
    htlcStep,
    offerId: offer._id
  }
  console.log(`createHtlc3: txInfo:`, txInfo)

  return { buildConfig, txInfo }
}

function prepareHtlcConfig3Btc (order, offer, portfolio, secret, changeAddr) {
  const amount = offer.quantity * offer.price
  const toAddress = offer.btcAddress
  const refundAddr = order.btcAddress
  typeforce(types.Address, toAddress)
  typeforce(types.Address, refundAddr)

  // todo: calculate transaction fee:
  const fee = 1000
  const htlcStep = 3

  // We unlock htlc2 here (so using timelock2):
  const timelock = offer.timelock2

  // Note: we don't need our own UTXO since we are just unlocking HTLC payment.

  const buildConfig = {
    vin: [{
      // Main input of the locked HTLC amount:
      txid: offer.htlcTxId2,
      vout: 0,
      keyPair: portfolio.findAddress(offer.btcAddress).keyPair,
      htlc: {
        secret,
        // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
        refundAddr,
        timelock
      },
      sequence: '4294967295'
    }],
    vout: [{
      // Main output (unlocking HTLC payment). Note: there is no change for this transfer.
      value: amount - fee,
      address: toAddress
    }]
  }

  const txInfo = {
    address: offer.eqbAddress,
    addressTxid: buildConfig.vin[0].txid,
    addressVout: buildConfig.vin[0].vout,
    type: 'SELL',
    fee,
    currencyType: 'BTC',
    amount,
    description: `Collecting payment from HTLC (step #${htlcStep})`,
    fromAddress: order.btcAddress,
    toAddress: offer.btcAddress,
    htlcStep,
    offerId: offer._id
  }
  console.log(`createHtlc3: txInfo:`, txInfo)

  return { buildConfig, txInfo }
}

export {
  createHtlc3,
  prepareHtlcConfig3
}
