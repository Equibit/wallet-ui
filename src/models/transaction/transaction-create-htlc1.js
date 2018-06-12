import typeforce from 'typeforce'
import { merge, pick } from 'ramda'
import { eqbTxBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareHtlcConfigEqb } from './transaction-create-htlc2'
import ErrorData from '../error'

// const simpleHashlockSigContract = eqbTxBuilder.simpleHashlockSigContract
const hashTimelockContract = eqbTxBuilder.hashTimelockContract

// Having data models (offer, order, portfolio, issuance)
// create HTLC transaction in blockchain
// and instantiate Transaction for DB

/**
 * For the given Offer creates HTLC transaction with H(x). Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 */
function createHtlc1 (blockchainInfo, offer, order, portfolio, issuance, changeAddr, transactionFeeRates) {
  typeforce(typeforce.tuple(
    {network: types.Network, sha: '?String'}, 'Offer', 'Order', 'Portfolio', typeforce.maybe('Issuance'), types.Address, {EQB: 'Number', BTC: 'Number'}),
    arguments
  )
  if (order.assetType === 'ISSUANCE') {
    typeforce('Issuance', issuance)
  }
  const currencyType = order.type === 'SELL' ? 'BTC' : 'EQB'
  const transactionFeeRate = transactionFeeRates[currencyType]

  function build(currencyType, transactionFee) {
    // First we build with a default fee to get tx hex, then rebuild with the estimated fee.
    let txConfig = order.type === 'SELL'
      ? prepareHtlcConfigBtc(offer, order, portfolio, changeAddr, transactionFee)
      : prepareHtlcConfigEqb(offer, order, portfolio, issuance, changeAddr, transactionFee)
    let tx = buildTransaction(currencyType)(txConfig.buildConfig.vin, txConfig.buildConfig.vout, blockchainInfo)
    if (!transactionFee) {
      // Calculate fee and rebuild:
      transactionFee = tx.hex.length / 2 * transactionFeeRate
      console.log(`transactionFee: ${tx.hex.length} / 2 * ${transactionFeeRate} = ${transactionFee}`)
      return build(currencyType, transactionFee)
    } else {
      return {tx, txConfig}
    }
  }

  const { tx, txConfig } = build(currencyType)
  const txData = prepareTxData(txConfig, tx, issuance)

  txData.htlcStep = 1
  txData.description = order.type === 'SELL' ? 'Buying securities (HTLC #1)' : 'Offering securities (HTLC #1)'

  return txData
}

// Ask flow.
// Buy Offer / Sell Order. BTC currency type.
// HTLC-1 is a BTC transaction from <offer creator> to <order creator>
function prepareHtlcConfigBtc (offer, order, portfolio, changeAddr, transactionFee) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', types.Address, '?Number'), arguments)
  typeforce('Number', offer.timelock)
  typeforce('String', offer.hashlock)

  const amount = offer.quantity * order.price * order.priceMutliplier
  // We reuse this method for both HTLC1 (Ask) and HTLC2 (Bid), so toAddress will be different:
  const toAddress = order.type === 'SELL' ? order.btcAddress : offer.btcAddress
  const refundAddress = order.type === 'SELL' ? offer.btcAddress : order.btcAddress

  // First build tx with the default rate, then based on the tx size calculate the real fee:
  const fee = transactionFee || 3000

  const timelock = order.type === 'SELL' ? offer.timelock : offer.timelock2
  const hashlock = offer.hashlock

  const utxoInfo = portfolio.getTxouts(amount + fee, 'BTC')
  if (!utxoInfo.sum) {
    throw new ErrorData({
      amount,
      fee
    }, `Not enough BTC for the amount ${amount + fee}`)
  }
  const availableAmount = utxoInfo.sum
  const utxo = utxoInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))

  // const script = simpleHashlockSigContract(toAddress, hashlock)
  const script = hashTimelockContract(toAddress, refundAddress, hashlock, timelock)
  console.log(`script = ${script.toString('hex')}`)

  const buildConfig = {
    vin: utxo.map(pick(['txid', 'vout', 'keyPair'])),
    vout: [{
      value: amount,
      scriptPubKey: script
    }, {
      value: availableAmount - amount - fee,
      address: changeAddr
    }]
  }

  const txInfo = {
    address: utxo[0].address,
    addressTxid: utxo[0].txid,
    addressVout: utxo[0].vout,
    fromAddress: utxo[0].address,
    toAddress,
    refundAddress,
    amount,
    fee,
    type: 'TRADE',
    assetType: order.assetType,
    currencyType: 'BTC',
    hashlock: offer.hashlock,
    timelock,
    buildConfig,
    offerId: offer._id,
    costPerShare: offer.price
  }

  return { buildConfig, txInfo }
}

function prepareTxData (htlcConfig, tx, issuance) {
  return Object.assign(htlcConfig.txInfo, {
    hex: tx.hex,
    txId: tx.txId
  }, issuance && {
    issuanceId: issuance._id,
    companyName: issuance.companyName,
    companySlug: issuance.companySlug,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType,
    issuanceUnit: issuance.issuanceUnit
  })
}

export {
  createHtlc1,
  prepareHtlcConfigBtc,
  prepareTxData
}
