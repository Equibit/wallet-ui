import { bitcoin, eqbTxBuilder, txBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import typeforce from 'typeforce'

function buildTransactionOld (currencyType) {
  return currencyType === 'BTC' ? buildTransactionBtcOld : buildTransactionEqb
}

// Note: use tx-builder for both currency types.
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
function buildTransactionBtcOld (inputs, outputs, network = bitcoin.networks.testnet) {
  typeforce(typeforce.tuple('Array', 'Array', types.Network), [inputs, outputs, network])
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

// eslint-disable-next-line
const addProp = (prop, val) => obj => (obj[prop] = val, obj)

function buildTransactionBtc (inputs, outputs, network = bitcoin.networks.testnet) {
  console.log(`buildTransactionBtc`, arguments)
  typeforce(typeforce.arrayOf({txid: 'String', vout: 'Number', keyPair: 'ECPair'}), inputs)
  typeforce(typeforce.arrayOf({
    value: types.Satoshi,
    scriptPubKey: '?Buffer',
    address: typeforce.maybe(types.Address)
  }), outputs)
  typeforce(types.Network, network)

  const tx = {
    version: 1,
    locktime: 0,
    vin: inputs.map(addProp('sequence', '4294967295')),
    vout: outputs
  }
  const bufferTx = txBuilder.builder.buildTx(tx)
  const hex = bufferTx.toString('hex')
  const txId = eqbTxBuilder.getTxId(bufferTx)
  console.log(`[buildTransactionBtc] hex = ${hex}, \ntxid = ${txId}`)

  return {
    txId,
    hex
  }
}

function buildTransactionEqb (inputs, outputs, network = bitcoin.networks.testnet) {
  typeforce(typeforce.tuple('Array', 'Array', types.Network), [inputs, outputs, network])
  const vout = outputs.map(vout => {
    vout.equibit = {
      // TODO: pass payment currency type here.
      payment_currency: 0,
      payment_tx_id: '',
      issuance_tx_id: (vout.issuanceTxId ? vout.issuanceTxId : '0000000000000000000000000000000000000000000000000000000000000000'),
      issuance_json: (vout.issuanceJson ? JSON.stringify(vout.issuanceJson) : '')
    }
    delete vout.issuanceTxId
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

// Note: all values are already in Satoshi to not run into Math JS craziness.
function toSatoshi (val) {
  typeforce(types.Satoshi, val)
  return val
}

export {
  buildTransaction,
  buildTransactionBtc,
  buildTransactionEqb,
  toSatoshi,
  buildTransactionOld
}
