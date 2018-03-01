import { eqbTxBuilder, txBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { pick } from 'ramda'
import typeforce from 'typeforce'
import { buildTransactionOld as buildTransaction, toSatoshi } from './transaction-build'

const hashTimelockContract = eqbTxBuilder.hashTimelockContract
// eslint-disable-next-line
const buildTx = txBuilder.builder.buildTx
// eslint-disable-next-line
const buildTxEqb = eqbTxBuilder.builder.buildTx

/**
 * Creates configuration object (including a built transaction hex) for instantiating a Transaction.
 */
function makeTransaction (
  amount, toAddress, txouts,
  {
    fee, changeAddr, network, type, currencyType, description,
    issuanceJson, issuanceTxId, issuance, changeAddrEmptyEqb,
    amountEqb, offerId, costPerShare
  }
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
    if (fee >= outputs[0].value) {
      fee = outputs[0].value - 1
    }
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
    txId: txInfo.txId,
    fromAddress: txouts[0].address,
    toAddress,
    offerId,
    costPerShare
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
    issuanceId: issuance._id || issuance.issuanceId,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType,
    issuanceUnit: issuance.issuanceUnit
  }
}

/**
 * Creates configuration object (inc a built HTLC transaction hex) for instantiating a Transaction.
 */
function makeHtlc (
  amount, toAddressA, toAddressB, hashlock, timelock, txouts,
  { fee, changeAddr, network, type, currencyType, description, htlcStep,
    issuance, emptyEqbUtxo, emptyEqbAmount, emptyEqbFee, emptyEqbChangeAddr }
) {
  console.log(`makeHtlc`, arguments)
  typeforce(typeforce.tuple(
    'Number',
    types.Address,
    types.Address,
    'String',
    'Number',
    'Array',
    {
      currencyType: 'String'
    }
  ), arguments)
  if (txouts.length === 0) {
    throw new Error('At least one transaction input is required')
  }
  if (currencyType === 'EQB') {
    typeforce('Issuance', issuance)
    const issuanceTxId = issuance.utxo && issuance.utxo[0] && issuance.utxo[0].txid
    typeforce('String', issuanceTxId)
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
      value: currencyType === 'BTC' ? (availableAmount - amount - fee) : (availableAmount - amount),
      address: changeAddr
    }]
  }
  if (currencyType === 'EQB') {
    tx.vin.forEach(out => {
      out.issuanceTxId = issuance.utxo[0].txid
    })
    tx.vin.push(emptyEqbUtxo.map(out => {
      return {
        txid: out.txid,
        vout: out.vout,
        script: '',
        keyPair: out.keyPair,
        sequence: '4294967295'
      }
    }))
    tx.vout.push({
      value: emptyEqbAmount - fee,
      address: changeAddr
    })
  }
  // const txBuffer = currencyType === 'BTC' ? buildTx(tx) : buildTxEqb(tx)
  // const txId = txBuilder.hashFromBuffer(txBuffer)
  // console.log(`tx hex = ${txBuffer.toString('hex')}`)
  // console.log(`tx id  = ${txId}`)
  const txData = {
    address: txouts[0].address,
    addressTxid: txouts[0].txid,
    addressVout: txouts[0].vout,
    fee,
    type,
    currencyType,
    amount,
    description,
    // hex: txBuffer.toString('hex'),
    // txId: txId,
    fromAddress: txouts[0].address,
    toAddress: toAddressA,
    refundAddress: toAddressB,
    timelock,
    hashlock,
    htlcStep
  }

  // add issuance details:
  if (issuance) {
    Object.assign(txData, addIssuanceDetails(issuance))
  }
  return txData
}

export {
  makeTransaction,
  makeHtlc
}
