import typeforce from 'typeforce'
import { merge } from 'ramda'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { TxId } from '../../utils/typeforce-types'
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
const [createHtlc4, createHtlcRefund4] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, issuance, secret, changeAddr, transactionFeeRates, locktime = 0) {
    typeforce(
      typeforce.tuple('Order', 'Offer', 'Portfolio', 'Issuance', 'String', typeforce.maybe(types.Address), {EQB: 'Number', BTC: 'Number'}),
      arguments
    )
    console.log(`createHtlc4 arguments:`, arguments)
    const currencyType = order.type === 'SELL' ? 'BTC' : 'EQB'
    const transactionFeeRate = transactionFeeRates[currencyType]

    // First we build with a default fee to get tx hex, then rebuild with the estimated fee.
    let htlcConfig = currencyType === 'BTC'
      ? (isRefund ? prepareHtlcRefundConfig4 : prepareHtlcConfig4)(order, offer, portfolio, secret)
      : (isRefund ? prepareHtlcRefundConfig4Eqb : prepareHtlcConfig4Eqb)(order, offer, portfolio, secret, issuance, changeAddr)
    // todo: generalize to both Ask and Bid.
    let tx = buildTransaction(currencyType)(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout, undefined, locktime)

    // Calculate fee and rebuild:
    const transactionFee = tx.hex.length / 2 * transactionFeeRate
    console.log(`transactionFee: ${tx.hex.length} / 2 * ${transactionFeeRate} = ${transactionFee}`)

    htlcConfig = currencyType === 'BTC'
      ? (isRefund ? prepareHtlcRefundConfig4 : prepareHtlcConfig4)(order, offer, portfolio, secret, transactionFee)
      : (isRefund ? prepareHtlcRefundConfig4Eqb : prepareHtlcConfig4Eqb)(order, offer, portfolio, secret, issuance, changeAddr, transactionFee)
    // todo: generalize to both Ask and Bid.
    tx = buildTransaction(currencyType)(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout, undefined, locktime)

    const txData = prepareTxData(htlcConfig, tx, issuance)

    return txData
  }
})

// Ask flow: seller (order creator) collects locked payment.
const [prepareHtlcConfig4, prepareHtlcRefundConfig4] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, secret, transactionFee) {
    console.log('prepareHtlcConfig4', arguments)
    typeforce(
      typeforce.tuple('Order', 'Offer', 'Portfolio', 'String'),
      arguments
    )
    const htlcStep = 4
    const amount = offer.quantity * order.price

    let fee = transactionFee || 3000
    if (fee > amount) {
      fee = amount - 1
    }

    const buildConfig = {
      vin: [{
        // Main input of the locked HTLC:
        txid: offer.htlcTxId1,
        vout: 0,
        // todo: we can have a problem here with giving one BTC address to all offers.
        keyPair: portfolio.findAddress(order.btcAddress).keyPair,
        htlc: {
          [isRefund ? 'secretHash' : 'secret']: isRefund ? offer.hashlock : secret,
          // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
          refundAddr: offer.btcAddress,
          timelock: offer.timelock
        },
        sequence: isRefund ? '0' : '4294967295'
      }],
      vout: [{
        // Main output for unlocked HTLC minus fee:
        value: amount - fee,
        // todo: should we send to a completely new BTC address? (e.g. multiple offers case)
        address: isRefund ? offer.btcAddress : order.btcAddress
      }]
    }

    const txInfo = {
      address: order.btcAddress,
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'CANCEL' : 'SELL',
      fee,
      currencyType: 'BTC',
      amount: offer.quantity * order.price - fee,
      description: `Collecting payment from HTLC (step #${htlcStep})`,
      fromAddress: offer.btcAddress,
      toAddress: order.btcAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }
    console.log(`createHtlc3: txInfo:`, txInfo)

    return { buildConfig, txInfo }
  }
})

// Bid flow: buyer (order creator) collects locked securities.
const [prepareHtlcConfig4Eqb, prepareHtlcRefundConfig4Eqb] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, secret, issuance, changeAddr, transactionFee) {
    console.log('prepareHtlcConfig4', arguments)
    typeforce(
      typeforce.tuple('Order', 'Offer', 'Portfolio', 'String', 'Issuance', types.Address),
      arguments
    )
    const fee = transactionFee || 3000
    const htlcStep = 4
    const amount = offer.quantity
    const paymentTxId = offer.htlcTxId2
    typeforce(TxId, paymentTxId)

    // We unlock htlc1 here (so using timelock):
    const timelock = offer.timelock

    // For EQB the fee comes from empty EQB.
    const utxoEmptyEqbInfo = portfolio.getEmptyEqb(fee)
    if (!utxoEmptyEqbInfo.sum) {
      throw new Error('Not enough empty EQB to cover the fee')
    }
    const availableAmountEmptyEqb = utxoEmptyEqbInfo.sum
    const utxoEmptyEqb = utxoEmptyEqbInfo.txouts
      .map(a => merge(a, {
        keyPair: portfolio.findAddress(a.address).keyPair,
        sequence: isRefund ? '0' : '4294967295'
      }))

    const buildConfig = {
      vin: [{
        // Main input of the locked HTLC:
        txid: offer.htlcTxId1,
        vout: 0,
        keyPair: portfolio.findAddress(order.eqbAddress).keyPair,
        htlc: {
          secret,
          // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
          refundAddr: offer.eqbAddress,
          timelock
        },
        sequence: isRefund ? '0' : '4294967295'
      }],
      vout: [{
        // Main output for unlocked HTLC securities:
        value: amount,
        address: order.eqbAddress,
        issuanceTxId: issuance.issuanceTxId,
        paymentTxId
      }, {
        // Regular change output:
        value: availableAmountEmptyEqb - fee,
        address: changeAddr
      }]
    }
    buildConfig.vin = buildConfig.vin.concat(utxoEmptyEqb)

    const txInfo = {
      address: order.eqbAddress,
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'CANCEL' : 'SELL',
      fee,
      currencyType: 'EQB',
      amount: amount,
      description: `Collecting securities from HTLC (step #${htlcStep})`,
      fromAddress: offer.eqbAddress,
      toAddress: order.eqbAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }
    console.log(`createHtlc3: txInfo:`, txInfo)

    return { buildConfig, txInfo }
  }
})

export {
  createHtlc4,
  createHtlcRefund4,
  prepareHtlcConfig4,
  prepareHtlcRefundConfig4
}
