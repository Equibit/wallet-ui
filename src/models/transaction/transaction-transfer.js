import typeforce from 'typeforce'
import { merge, pick } from 'ramda'
import { eqbTxBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareTxData } from './transaction-create-htlc1'
import ErrorData from '../error'

/**
 * Note: issuance change will be returned to its original UTXO address.
 */
function createTransfer (type, amount, toAddress, changeAddr, portfolio, issuance, transactionFeeRates, description) {
  typeforce(typeforce.tuple(
    typeforce.oneOf(
      typeforce.value('BTC'),
      typeforce.value('EQB'),
      typeforce.value('ISSUANCE')
    ),
    types.Satoshi, types.Address, types.Address, 'Portfolio', '?Issuance',
    {EQB: 'Number', BTC: 'Number'}, '?String'
  ), arguments)
  if (type === 'ISSUANCE') {
    typeforce('Issuance', issuance)
  }

  const currencyType = type === 'BTC' ? 'BTC' : 'EQB'
  const transactionFeeRate = transactionFeeRates[currencyType]

  // First we build with a default fee to get tx hex, then rebuild with the estimated fee.
  let txConfig = currencyType === 'BTC'
    ? prepareConfigBtc(amount, toAddress, changeAddr, portfolio, transactionFeeRates, description)
    : prepareConfigEqb(amount, toAddress, changeAddr, portfolio, issuance, transactionFeeRates, description)
  let tx = buildTransaction(currencyType)(txConfig.buildConfig.vin, txConfig.buildConfig.vout)

  // Calculate fee and rebuild:
  const transactionFee = tx.hex.length / 2 * transactionFeeRate
  console.log(`transactionFee: ${tx.hex.length} / 2 * ${transactionFeeRate} = ${transactionFee}`)
  txConfig = currencyType === 'BTC'
    ? prepareConfigBtc(amount, toAddress, changeAddr, portfolio, transactionFeeRates, description, transactionFee)
    : prepareConfigEqb(amount, toAddress, changeAddr, portfolio, issuance, transactionFeeRates, description, transactionFee)
  tx = buildTransaction(currencyType)(txConfig.buildConfig.vin, txConfig.buildConfig.vout)

  const txData = prepareTxData(txConfig, tx, issuance)

  txData.description = description

  return txData
}

// Transfer BTC:
function prepareConfigBtc (
  amount, toAddress, changeAddr, portfolio,
  transactionFeeRates, description, transactionFee
) {
  typeforce(typeforce.tuple(
    'Number', types.Address, types.Address, 'Portfolio',
    {EQB: 'Number', BTC: 'Number'}, '?String', '?Number'
  ), arguments)

  // First build tx with the default rate, then based on the tx size calculate the real fee:
  const fee = transactionFee || 3000

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

  const buildConfig = {
    vin: utxo.map(pick(['txid', 'vout', 'keyPair'])),
    vout: [{
      value: amount,
      address: toAddress
    }, {
      value: availableAmount - amount - fee,
      address: changeAddr
    }]
  }

  const txInfo = {
    address: utxo[0].address,
    // These two are for API validations:
    addressTxid: utxo[0].txid,
    addressVout: utxo[0].vout,
    fromAddress: utxo[0].address,
    toAddress,
    amount,
    fee,
    type: 'TRANSFER',
    currencyType: 'BTC',
    buildConfig
  }

  return { buildConfig, txInfo }
}

// Transfer EQB or Issuance:
function prepareConfigEqb (
  amount, toAddress, changeAddr, portfolio, issuance,
  transactionFeeRates, description, transactionFee
) {
  typeforce(typeforce.tuple(
    'Number', types.Address, types.Address, 'Portfolio', '?Issuance',
    {EQB: 'Number', BTC: 'Number'}, '?String', '?Number'
  ), arguments)

  const assetType = issuance ? 'ISSUANCE' : 'EQUIBIT'

  // First build tx with the default rate, then based on the tx size calculate the real fee:
  const fee = transactionFee || 3000

  // Define UTXO for transaction input:
  let utxo
  let availableAmount
  let availableAmountEmptyEqb
  let changeAddrMain
  let changeAddrFee

  // Issuance case:
  if (assetType === 'ISSUANCE') {
    // todo: validate that issuance and portfolio have enough utxo (results in a non-empty array).
    const issuanceUtxoInfo = issuance.getTxoutsFor(amount)
    if (!issuanceUtxoInfo.sum) {
      throw new Error(`Not enough UTXO for the authorized issuance of the amount ${amount}`)
    }
    availableAmount = issuanceUtxoInfo.sum
    const issuanceUtxo = issuanceUtxoInfo.txouts
      .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

    changeAddrMain = issuanceUtxo[0].address
    changeAddrFee = changeAddr

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

    changeAddrMain = changeAddr
  }

  const buildConfig = {
    vin: utxo.map(pick(['txid', 'vout', 'keyPair'])),
    vout: [{
      // main output:
      value: amount,
      address: toAddress,
      issuanceTxId: issuance && issuance.issuanceTxId
    }, {
      // change from the main output:
      value: assetType === 'ISSUANCE' ? (availableAmount - amount) : (availableAmount - amount - fee),
      address: changeAddrMain,
      issuanceTxId: issuance && issuance.issuanceTxId
    }]
  }
  if (assetType === 'ISSUANCE') {
    buildConfig.vout.push({
      // change for Empty EQB (for transaction fee):
      value: availableAmountEmptyEqb - fee,
      address: changeAddrFee
    })
  }

  const txInfo = {
    address: utxo[0].address,
    addressTxid: utxo[0].txid,
    addressVout: utxo[0].vout,
    fromAddress: utxo[0].address,
    toAddress,
    amount,
    fee,
    type: 'TRANSFER',
    assetType,
    currencyType: 'EQB',
    buildConfig
  }

  return { buildConfig, txInfo }
}

export {
  createTransfer
}
