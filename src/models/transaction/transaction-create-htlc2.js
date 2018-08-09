import typeforce from 'typeforce'
import { merge, pick } from 'ramda'
import { eqbTxBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { BlockchainInfoBySymbol } from '../../utils/typeforce-types'
import { buildTransaction } from './transaction-build'
import { prepareHtlcConfigBtc, prepareTxData } from './transaction-create-htlc1'
// DAVID THIS WHOLE FILE
const hashTimelockContract = eqbTxBuilder.hashTimelockContract
// const simpleHashlockContract = eqbTxBuilder.simpleHashlockContract
// const simpleHashlockAddrContract = eqbTxBuilder.simpleHashlockAddrContract
// const simpleHashlockSigContract = eqbTxBuilder.simpleHashlockSigContract

/**
 * Creates HTLC transaction with H(x). Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 */
function createHtlc2 (blockchainInfoBySymbol, offer, order, portfolio, issuance, changeAddr, transactionFeeRates) {
  typeforce(typeforce.tuple(
    BlockchainInfoBySymbol, 'Offer', 'Order', 'Portfolio', '?Issuance', types.Address, {EQB: 'Number', BTC: 'Number'}),
    arguments
  )
  typeforce(typeforce.tuple('Number', 'String'), [offer.timelock, offer.hashlock])
  if (order.assetType === 'ISSUANCE') {
    typeforce('Issuance', issuance)
  }
  const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
  const transactionFeeRate = transactionFeeRates[currencyType]

  function build (currencyType, transactionFee) {
    // First we build with a default fee to get tx hex, then rebuild with the estimated fee.
    let txConfig = currencyType === 'EQB'
      ? prepareHtlcConfigEqb(offer, order, portfolio, issuance, changeAddr, transactionFee)
      : prepareHtlcConfigBtc(offer, order, portfolio, changeAddr, transactionFee)
    let tx = buildTransaction(currencyType)(txConfig.buildConfig.vin, txConfig.buildConfig.vout, blockchainInfoBySymbol[currencyType])
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

  txData.htlcStep = 2
  txData.description = order.type === 'SELL'
    ? (order.assetType === 'ISSUANCE' ? 'Sending securities (HTLC #2)' : 'Sending blank EQB (HTLC #2)')
    : 'Sending payment (HTLC #2)'

  return txData
}

// HTLC-2 is an blockchain transaction from <order creator> to <offer creator>
//    - Ask flow (Sell order / Buy offer). EQB currency type.
//    - Bid flow (Buy order / Sell offer). BTC currency type.
function prepareHtlcConfigEqb (offer, order, portfolio, issuance, changeAddrEmptyEqb, transactionFee) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', '?Issuance', types.Address, '?Number'), arguments)
  if (order.assetType === 'ISSUANCE') {
    typeforce('Issuance', issuance)
  }

  const amount = offer.quantity
  const assetType = order.assetType
  // We reuse this method for both HTLC1 (Bid) and HTLC2 (Ask), so toAddress will be different:
  const toAddress = order.type === 'SELL' ? offer.eqbAddress : order.eqbAddress

  // First build tx with the default rate, then based on the tx size calculate the real fee:
  const fee = transactionFee || 3000

  // Note: timelock for htlc2 should be smaller than htlc1 (e.g. 1/2):
  // Since we reuse this method for both Ask/Bid flows timelock is different.
  const timelock = order.type === 'SELL' ? offer.timelock2 : offer.timelock

  const hashlock = offer.hashlock

  // Define UTXO for transaction input:
  let utxo
  let availableAmount
  let availableAmountEmptyEqb
  let changeAddr
  let refundAddress

  // Issuance case:
  if (assetType === 'ISSUANCE') {
    // todo: validate that issuance and portfolio have enough utxo (results in a non-empty array).
    const issuanceUtxoInfo = issuance.getTxoutsFor(offer.quantity)
    if (!issuanceUtxoInfo.sum) {
      throw new Error(`Not enough UTXO for the authorized issuance of the amount ${offer.quantity}`)
    }
    availableAmount = issuanceUtxoInfo.sum
    const issuanceUtxo = issuanceUtxoInfo.txouts
      .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

    // For Sell order we set both change addr for securities and the refund to the same holding address from where we send securities.
    refundAddress = issuanceUtxo[0].address
    changeAddr = refundAddress

    // For EQB the fee comes from empty EQB.
    const utxoEmptyEqbInfo = portfolio.getEmptyEqb(fee)
    if (!utxoEmptyEqbInfo.sum) {
      throw new Error(`Not enough empty EQB to cover the fee ${fee}`)
    }
    availableAmountEmptyEqb = utxoEmptyEqbInfo.sum
    const utxoEmptyEqb = utxoEmptyEqbInfo.txouts
      .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))

    utxo = issuanceUtxo.concat(utxoEmptyEqb)
  }

  // Blank Equibit case:
  if (assetType === 'EQUIBIT') {
    const utxoInfo = portfolio.getEmptyEqb(amount + fee)
    if (!utxoInfo.sum) {
      throw new Error(`Not enough empty EQB to cover the amount + fee ${amount + fee}`)
    }
    availableAmount = utxoInfo.sum
    utxo = utxoInfo.txouts
      .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))
    // todo: generate a new address:
    refundAddress = utxo[0].address
    changeAddr = changeAddrEmptyEqb
  }

  // HTLC SCRIPT:
  const htlcScript = hashTimelockContract(toAddress, refundAddress, hashlock, timelock)

  const buildConfig = {
    vin: utxo.map(pick(['txid', 'vout', 'keyPair'])),
    vout: [{
      // main output:
      value: amount,
      scriptPubKey: htlcScript,
      issuanceTxId: issuance && issuance.issuanceTxId
    }, {
      // change from the main output:
      value: assetType === 'ISSUANCE' ? (availableAmount - amount) : (availableAmount - amount - fee),
      address: changeAddr,
      issuanceTxId: issuance && issuance.issuanceTxId
    }]
  }
  if (assetType === 'ISSUANCE') {
    buildConfig.vout.push({
      // change for Empty EQB (for transaction fee):
      value: availableAmountEmptyEqb - fee,
      address: changeAddrEmptyEqb
    })
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
    currencyType: 'EQB',
    // description: `Selling securities (HTLC #${htlcStep})`,
    hashlock: offer.hashlock,
    timelock: timelock,
    buildConfig,
    offerId: offer._id,
    costPerShare: offer.price
  }

  return { buildConfig, txInfo }
}

export {
  createHtlc2,
  prepareHtlcConfigEqb
}
