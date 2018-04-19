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
      typeforce.tuple('Order', 'Offer', 'Portfolio', '?Issuance', 'String', typeforce.maybe(types.Address), {EQB: 'Number', BTC: 'Number'}),
      arguments
    )
    if (order.assetType === 'ISSUANCE') {
      typeforce('Issuance', issuance)
    }

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

// BTC. Ask flow: seller (order creator) collects locked payment.
const [prepareHtlcConfig4, prepareHtlcRefundConfig4] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, secret, transactionFee) {
    console.log('prepareHtlcConfig4', arguments)
    typeforce(
      typeforce.tuple('Order', 'Offer', 'Portfolio', 'String'),
      arguments
    )
    const assetType = order.assetType
    const htlcStep = 4
    const amount = offer.quantity * order.price * order.priceMutliplier

    let fee = transactionFee || 3000
    if (fee > amount) {
      fee = amount - 1
    }

    // Note: we are reusing the existing address which has the locked funds, and just unlock them.
    const toAddress = isRefund ? offer.btcAddress : order.btcAddress

    const buildConfig = {
      vin: [{
        // Main input of the locked HTLC:
        txid: offer.htlcTxId1,
        vout: 0,
        // todo: we can have a problem here with giving one BTC address to all offers.
        keyPair: portfolio.findAddress(isRefund ? offer.btcAddress : order.btcAddress).keyPair,
        htlc: {
          [isRefund ? 'secretHash' : 'secret']: isRefund ? offer.hashlock : secret,
          // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
          receiverAddr: order.btcAddress,
          refundAddr: offer.btcAddress,
          timelock: offer.timelock
        },
        sequence: isRefund ? '0' : '4294967295'
      }],
      vout: [{
        // Main output for unlocked HTLC minus fee:
        value: amount - fee,
        // todo: should we send to a completely new BTC address? (e.g. multiple offers case)
        address: toAddress
      }]
    }

    const txInfo = {
      address: toAddress,
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'CANCEL' : 'SELL',
      assetType,
      fee,
      currencyType: 'BTC',
      amount: offer.quantity * order.price * order.priceMutliplier - fee,
      description: `${isRefund ? 'Refunding' : 'Collecting'} payment from HTLC (step #${htlcStep})`,
      fromAddress: offer.btcAddress,
      toAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }
    console.log(`createHtlc4: txInfo:`, txInfo)

    return { buildConfig, txInfo }
  }
})

// EQB. Bid flow: buyer (order creator) collects locked securities.
const [prepareHtlcConfig4Eqb, prepareHtlcRefundConfig4Eqb] = [false, true].map(isRefund => {
  return function (order, offer, portfolio, secret, issuance, changeAddr, transactionFee) {
    console.log('prepareHtlcConfig4', arguments)
    typeforce(
      typeforce.tuple('Order', 'Offer', 'Portfolio', 'String', 'Issuance', types.Address),
      arguments
    )
    const assetType = order.assetType
    let fee = transactionFee || 3000
    const htlcStep = 4
    const amount = offer.quantity
    const paymentTxId = offer.htlcTxId2
    typeforce(TxId, paymentTxId)

    // We unlock htlc1 here (so using timelock):
    const timelock = offer.timelock

    const toAddress = isRefund ? offer.eqbAddress : order.eqbAddress

    const buildConfig = {
      vin: [{
        // Main input of the locked HTLC:
        txid: offer.htlcTxId1,
        vout: 0,
        keyPair: portfolio.findAddress(isRefund ? offer.eqbAddress : order.eqbAddress).keyPair,
        htlc: {
          secret,
          // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
          receiverAddr: order.eqbAddress,
          refundAddr: offer.eqbAddress,
          timelock
        },
        sequence: isRefund ? '0' : '4294967295'
      }],
      vout: [{
        // Main output for unlocked HTLC securities:
        value: amount,
        address: toAddress,
        issuanceTxId: issuance && issuance.issuanceTxId,
        paymentTxId
      }]
    }
    if (assetType === 'ISSUANCE') {
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

    const txInfo = {
      address: toAddress,
      addressTxid: buildConfig.vin[0].txid,
      addressVout: buildConfig.vin[0].vout,
      type: isRefund ? 'CANCEL' : 'SELL',
      assetType,
      fee,
      currencyType: 'EQB',
      amount: amount,
      description: `${isRefund ? 'Refunding' : 'Collecting'} ${assetType === 'ISSUANCE' ? 'securities' : 'Blank EQB'} from HTLC (step #${htlcStep})`,
      fromAddress: offer.eqbAddress,
      toAddress,
      htlcStep,
      offerId: offer._id,
      costPerShare: offer.price
    }
    console.log(`createHtlc4: txInfo:`, txInfo)

    return { buildConfig, txInfo }
  }
})

export {
  createHtlc4,
  createHtlcRefund4,
  prepareHtlcConfig4,
  prepareHtlcRefundConfig4
}
