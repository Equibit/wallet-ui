import typeforce from 'typeforce'
import { merge } from 'ramda'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { TxId } from '../../utils/typeforce-types'
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
const [ createHtlc3, createHtlcRefund3 ] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, issuance, secret, changeAddr, transactionFeeRates, locktime = 0) {
    typeforce(
      typeforce.tuple('Order', 'Offer', 'Portfolio', 'Issuance', 'String', types.Address, {EQB: 'Number', BTC: 'Number'}),
      arguments
    )
    console.log(`createHtlc3 arguments:`, arguments)
    const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
    const transactionFeeRate = transactionFeeRates[currencyType]

    // First we build with a default fee to get tx hex, then rebuild with the estimated fee.
    let htlcConfig = currencyType === 'EQB'
      ? (isRefund ? prepareHtlcRefundConfig3 : prepareHtlcConfig3)(order, offer, portfolio, issuance, secret, changeAddr)
      : (isRefund ? prepareHtlcRefundConfig3Btc : prepareHtlcConfig3Btc)(order, offer, portfolio, secret, changeAddr)
    let tx = buildTransaction(currencyType)(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout, undefined, locktime)

    // Calculate fee and rebuild:
    const transactionFee = tx.hex.length / 2 * transactionFeeRate
    htlcConfig = currencyType === 'EQB'
      ? (isRefund ? prepareHtlcRefundConfig3 : prepareHtlcConfig3)(order, offer, portfolio, issuance, secret, changeAddr, transactionFee)
      : (isRefund ? prepareHtlcRefundConfig3Btc : prepareHtlcConfig3Btc)(order, offer, portfolio, secret, changeAddr, transactionFee)
    tx = buildTransaction(currencyType)(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout, undefined, locktime)

    const txData = prepareTxData(htlcConfig, tx, issuance)

    return txData
  }
})

// EQB transaction:
const [ prepareHtlcConfig3, prepareHtlcRefundConfig3 ] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, issuance, secret, changeAddr, transactionFee) {
    const amount = offer.quantity
    const toAddress = isRefund ? order.eqbAddress : offer.eqbAddress
    const refundAddr = order.eqbAddress
    const paymentTxId = offer.htlcTxId1
    typeforce(types.Address, toAddress)
    typeforce(types.Address, refundAddr)
    typeforce(TxId, paymentTxId)

    // First build tx with the default rate, then based on the tx size calculate the real fee:
    const fee = transactionFee || 3000
    const htlcStep = 3
    const timelock = order.type === 'SELL' ? offer.timelock2 : offer.timelock

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

    // Two cases for the receiving addr:
    // - investor: lookup keys in portfolio
    // - issuer: lookup keys directly in issuance
    const portfolioAddr = portfolio.findAddress(offer.eqbAddress)
    const keyPair = portfolioAddr ? portfolioAddr.keyPair : issuance.keys.keyPair
    const buildConfig = {
      vin: [{
        // Main input of the locked HTLC amount:
        txid: offer.htlcTxId2,
        vout: 0,
        keyPair: keyPair,
        htlc: {
          [isRefund ? 'secretHash' : 'secret']: isRefund ? offer.hashlock : secret,
          // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
          receiverAddr: offer.eqbAddress,
          refundAddr,
          timelock
        },
        sequence: isRefund ? '0' : '4294967295'
      }],
      vout: [{
        // Main output (unlocking HTLC securities):
        value: amount,
        address: toAddress,
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
      address: toAddress,
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'CANCEL' : 'BUY',
      fee,
      currencyType: 'EQB',
      amount,
      description: `${isRefund ? 'Refunding' : 'Collecting'} securities from HTLC (step #${htlcStep})`,
      fromAddress: order.eqbAddress,
      toAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }
    console.log(`createHtlc3: txInfo:`, txInfo)

    return { buildConfig, txInfo }
  }
})

const [ prepareHtlcConfig3Btc, prepareHtlcRefundConfig3Btc ] = [false, true].map(isRefund => {
  return function prepareHtlcConfig3Btc (order, offer, portfolio, secret, changeAddr, transactionFee) {
    const amount = offer.quantity * offer.price
    const toAddress = isRefund ? order.btcAddress : offer.btcAddress
    const refundAddr = order.btcAddress
    typeforce(types.Address, toAddress)
    typeforce(types.Address, refundAddr)

    // First build tx with the default rate, then based on the tx size calculate the real fee:
    let fee = transactionFee || 3000
    const htlcStep = 3

    if (fee > amount) {
      fee = amount - 1
    }

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
          [isRefund ? 'secretHash' : 'secret']: isRefund ? offer.hashlock : secret,
          // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
          refundAddr,
          timelock
        },
        sequence: isRefund ? '0' : '4294967295'
      }],
      vout: [{
        // Main output (unlocking HTLC payment). Note: there is no change for this transfer.
        value: amount - fee,
        address: toAddress
      }]
    }

    const txInfo = {
      address: isRefund ? order.eqbAddress : offer.eqbAddress,
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'CANCEL' : 'SELL',
      fee,
      currencyType: 'BTC',
      amount,
      description: `${isRefund ? 'Refunding' : 'Collecting'} payment from HTLC (step #${htlcStep})`,
      fromAddress: order.btcAddress,
      toAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }
    console.log(`createHtlc3: txInfo:`, txInfo)

    return { buildConfig, txInfo }
  }
})

export {
  createHtlc3,
  createHtlcRefund3,
  prepareHtlcConfig3,
  prepareHtlcRefundConfig3
}
