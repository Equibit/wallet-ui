import typeforce from 'typeforce'
import { merge } from 'ramda'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { TxId, BlockchainInfoBySymbol } from '../../utils/typeforce-types'
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
  return function (blockchainInfoBySymbol, order, offer, portfolio, issuance, secret, changeAddr, transactionFeeRates, locktime = 0) {
    typeforce(
      typeforce.tuple(BlockchainInfoBySymbol, 'Order', 'Offer', 'Portfolio', '?Issuance', 'String', types.Address, {EQB: 'Number', BTC: 'Number'}),
      arguments
    )
    if (order.assetType === 'ISSUANCE') {
      typeforce('Issuance', issuance)
    }
    const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
    const transactionFeeRate = transactionFeeRates[currencyType]

    function build (currencyType, transactionFee) {
      // First we build with a default fee to get tx hex, then rebuild with the estimated fee.
      let txConfig = currencyType === 'EQB'
        ? (isRefund ? prepareHtlcRefundConfig3 : prepareHtlcConfig3)(order, offer, portfolio, issuance, secret, changeAddr, transactionFee)
        : (isRefund ? prepareHtlcRefundConfig3Btc : prepareHtlcConfig3Btc)(order, offer, portfolio, secret, changeAddr, transactionFee)
      let tx = buildTransaction(currencyType)(txConfig.buildConfig.vin, txConfig.buildConfig.vout, blockchainInfoBySymbol[currencyType], locktime)
      if (!transactionFee) {
        // Calculate fee and rebuild:
        transactionFee = tx.hex.length / 2 * transactionFeeRate
        return build(currencyType, transactionFee)
      } else {
        return {tx, txConfig}
      }
    }

    const { tx, txConfig } = build(currencyType)
    const txData = prepareTxData(txConfig, tx, issuance)

    return txData
  }
})

// EQB transaction:
const [ prepareHtlcConfig3, prepareHtlcRefundConfig3 ] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, issuance, secret, changeAddr, transactionFee) {
    const amount = offer.quantity
    const fromAddress = isRefund ? offer.eqbAddress : order.eqbAddress
    const toAddress = isRefund ? order.eqbAddress : offer.eqbAddress
    const refundAddr = order.eqbAddress
    const paymentTxId = offer.htlcTxId1
    const assetType = order.assetType

    typeforce(types.Address, toAddress)
    typeforce(types.Address, refundAddr)
    typeforce(TxId, paymentTxId)

    // First build tx with the default rate, then based on the tx size calculate the real fee:
    let fee = transactionFee || 3000
    const htlcStep = 3
    const timelock = order.type === 'SELL' ? offer.timelock2 : offer.timelock

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
        issuanceTxId: issuance && issuance.issuanceTxId,
        paymentTxId
      }]
    }
    if (assetType === 'ISSUANCE') {
      // For Issuance the fee comes from blank EQB.
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
      buildConfig.vin = buildConfig.vin.concat(utxoEmptyEqb)
      buildConfig.vout.push({
        // Regular change output:
        value: availableAmountEmptyEqb - fee,
        address: changeAddr
      })
    } else {
      // For blank EQB subtract fee from the main output:
      // todo: check against the minimum fee value.
      if (amount < fee) {
        fee = 1
      }
      buildConfig.vout[0].value = amount - fee
    }

    const description = `${isRefund ? 'Refunding' : 'Collecting'} ${assetType === 'ISSUANCE' ? 'securities' : 'Blank EQB'} from HTLC (step #${htlcStep})`

    const txInfo = {
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'REFUND' : 'TRADE',
      assetType,
      fee,
      currencyType: 'EQB',
      amount,
      description,
      fromAddress,
      toAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }

    return { buildConfig, txInfo }
  }
})

const [ prepareHtlcConfig3Btc, prepareHtlcRefundConfig3Btc ] = [false, true].map(isRefund => {
  return function prepareHtlcConfig3Btc (order, offer, portfolio, secret, changeAddr, transactionFee) {
    const amount = offer.quantity * offer.price * offer.priceMutliplier
    const fromAddress = isRefund ? offer.btcAddress : order.btcAddress
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
          receiverAddr: offer.btcAddress,
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
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'REFUND' : 'TRADE',
      fee,
      currencyType: 'BTC',
      amount,
      description: `${isRefund ? 'Refunding' : 'Collecting'} payment from HTLC (step #${htlcStep})`,
      fromAddress,
      toAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }

    return { buildConfig, txInfo }
  }
})

export {
  createHtlc3,
  createHtlcRefund3,
  prepareHtlcConfig3,
  prepareHtlcRefundConfig3
}
