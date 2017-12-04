import { bitcoin, eqbTxBuilder, txBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { pick } from 'ramda'
import typeforce from 'typeforce'

const hashTimelockContract = eqbTxBuilder.hashTimelockContract
const buildTx = txBuilder.builder.buildTx

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

// Note: all values are in Satoshi to not run into Math JS craziness.
function toSatoshi (val) {
  if (Math.floor(val) < val) {
    console.error(`Attention! The value should be integer (in Satoshi) but received: ${val}`)
  }
  return val
  // return Math.floor(val * 100000000)
}

/**
 * Creates configuration object for instantiation a Transaction.
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
  // Note: the value is in Satoshi already:
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
    Object.assign(txData, addIssuanceDetails(issuance))
  }

  return txData
}

function addIssuanceDetails (issuance) {
  return {
    companyName: issuance.companyName,
    companySlug: issuance.companySlug,
    issuanceId: issuance._id,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType,
    issuanceUnit: issuance.issuanceUnit
  }
}

function makeHtlc (
  amount, toAddressA, toAddressB, hashlock, timelock, txouts,
  {fee, changeAddr, network, type, currencyType, description, issuanceJson, issuanceTxId, issuance, changeAddrEmptyEqb, amountEqb}
) {
  console.log(`makeHtlc`, arguments)
  typeforce(typeforce.tuple(
    'Number',
    types.Address,
    types.Address,
    'String',
    'Number',
    'Array',
    'Object'
  ), arguments)
  if (txouts.length === 0) {
    throw new Error('At least one transaction input is required')
  }
  const availableAmount = txouts.reduce((sum, { amount }) => (sum + amount), 0)
  const script = hashTimelockContract(toAddressA, toAddressB, hashlock, timelock)
  const tx = {
    version: 1,
    locktime: 0,
    vin: txouts.map(out => {
      return {
        txid: out.txid,
        vout: out.vout,
        script: '',
        keyPair: out.keyPair,
        sequence: '4294967295'
      }
    }),
    vout: [{
      value: amount,
      scriptPubKey: script
    }, {
      value: (availableAmount - amount - fee),
      address: changeAddr
    }]
  }
  const txBuffer = buildTx(tx)
  const txId = txBuilder.hashFromBuffer(txBuffer)
  console.log(`tx hex = ${txBuffer.toString('hex')}`)
  console.log(`tx id  = ${txId}`)
  const txData = {
    address: txouts[0].address,
    addressTxid: txouts[0].txid,
    addressVout: txouts[0].vout,
    fee,
    type,
    currencyType,
    amount,
    description,
    hex: txBuffer.toString('hex'),
    txIdBtc: currencyType === 'BTC' ? txId : undefined,
    txIdEqb: currencyType === 'EQB' ? txId : undefined,
    otherAddress: toAddressA,
    refundAddress: toAddressB,
    timelock
  }

  // add issuance details:
  if (issuance) {
    Object.assign(txData, addIssuanceDetails(issuance))
  }
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
