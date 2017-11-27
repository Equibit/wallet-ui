import { bitcoin, eqbTxBuilder } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { pick } from 'ramda'

function buildTransaction (currencyType) {
  return currencyType === 'BTC' ? buildTransactionBtc : buildTransactionEqb
}

/**
 * @function buildTransactionBtc
 * Builds a signed transaction.
 *
 * @param {Array<Object(txid, vout, keyPair)>} inputs
 * @param {Array<Object(address, value)>} outputs
 * @returns {Object<txId, hex>} A HEX code of the signed transaction and transaction id (hash).
 */
function buildTransactionBtc (inputs, outputs, network = bitcoin.networks.testnet) {
  const tx = new bitcoin.TransactionBuilder(network)
  inputs.forEach(({ txid, vout }, index) => tx.addInput(txid, vout))
  outputs.forEach(({address, value}) => tx.addOutput(address, value))
  inputs.forEach(({ keyPair }, index) => tx.sign(index, keyPair))
  console.log('- blockchain transaction: ', tx)
  const builtTx = tx.build()
  return {
    txId: builtTx.getId(),
    hex: builtTx.toHex()
  }
}

function buildTransactionEqb (inputs, outputs, network = bitcoin.networks.testnet) {
  const vout = outputs.map(vout => {
    vout.equibit = {
      // TODO: pass payment currency type here.
      payment_currency: 0,
      payment_tx_id: '',
      issuance_tx_id: (vout.issuanceTxId ? vout.issuanceTxId : '0000000000000000000000000000000000000000000000000000000000000000'),
      issuance_json: (vout.issuanceJson ? JSON.stringify(vout.issuanceJson) : '')
    }
    delete vout.issuanceJson
    return vout
  })
  const tx = {
    version: 2,
    locktime: 0,
    vin: inputs,
    vout
  }
  const bufferTx = eqbTxBuilder.builder.buildTx(tx)
  const hex = bufferTx.toString('hex')
  const txId = eqbTxBuilder.getTxId(bufferTx)
  console.log(`[buildTransactionEqb] hex = ${hex}, \ntxid = ${txId}`)

  return {
    txId,
    hex
  }
}

function toSatoshi (val) {
  return Math.floor(val * 100000000)
}

/**
 * Creates configuration object for instantiation Transaction.
 * @param amount
 * @param toAddress
 * @param txouts
 * @param fee
 * @param changeAddr
 * @param network
 * @param type
 * @param currencyType
 * @param description
 * @param issuanceJson
 * @param issuanceTxId
 * @param issuance
 * @param changeAddrEmptyEqb
 * @param amountEqb
 * @returns {{address, addressTxid: (string|string|string|string|string|string|*), addressVout: (*|Array|number), fee: *, type: *, currencyType: (String.currencyType|*), amount: *, description: *, hex: (string|*|string), txIdBtc: *, txIdEqb: *, otherAddress: *}}
 */
function makeTransaction (
  amount, toAddress, txouts,
  {fee, changeAddr, network, type, currencyType, description, issuanceJson, issuanceTxId, issuance, changeAddrEmptyEqb, amountEqb}
) {
  currencyType = currencyType.toUpperCase()
  const inputs = txouts.map(pick(['txid', 'vout', 'keyPair']))
  const availableAmount = txouts.reduce((acc, a) => acc + a.amount, 0)
  const outputs = [
    {address: toAddress, value: toSatoshi(amount)}
  ]
  if (changeAddr) {
    outputs.push({address: changeAddr, value: toSatoshi(availableAmount) - toSatoshi(amount) - toSatoshi(fee)})
  } else {
    // Case: cancel issuance with no change address (all issuance inputs will be emptied). Transaction fee is deducted here:
    outputs[0].value -= toSatoshi(fee)
  }
  // Case: auth issuance
  if (issuanceJson) {
    // todo: simplify and check the case where we send all available shares
    if (!issuanceTxId) {
      outputs[0].issuanceJson = issuanceJson
    } else {
      // Case: auth issuance with change:
      outputs[1].issuanceTxId = issuanceTxId
      outputs[1].value = toSatoshi(issuance.availableAmount - amount)
    }
  }
  if (issuanceTxId) {
    outputs[0].issuanceTxId = issuanceTxId
  }
  if (changeAddrEmptyEqb) {
    outputs.push({
      address: changeAddrEmptyEqb,
      value: toSatoshi(amountEqb - fee)
    })
  }
  const txInfo = buildTransaction(currencyType)(inputs, outputs, network)

  const txData = {
    address: txouts[0].address,
    addressTxid: txouts[0].txid,
    addressVout: txouts[0].vout,
    fee,
    type,
    currencyType,
    amount,
    description,
    hex: txInfo.hex,
    txIdBtc: currencyType === 'BTC' ? txInfo.txId : undefined,
    txIdEqb: currencyType === 'EQB' ? txInfo.txId : undefined,
    otherAddress: toAddress
  }

  // add issuance details:
  if (issuance) {
    txData.companyName = issuance.companyName
    txData.companySlug = issuance.companySlug
    txData.issuanceId = issuance._id
    txData.issuanceName = issuance.issuanceName
    txData.issuanceType = issuance.issuanceType
    txData.issuanceUnit = issuance.issuanceUnit
  }

  return txData
}

function makeHtlc (
  amount, toAddressA, toAddressB, hashlock, timelock, txouts,
  {fee, changeAddr, network, type, currencyType, description, issuanceJson, issuanceTxId, issuance, changeAddrEmptyEqb, amountEqb}
) {
  const txData = {}
  return txData
}

export {
  buildTransaction,
  buildTransactionBtc,
  buildTransactionEqb,
  toSatoshi,
  makeTransaction,
  makeHtlc
}