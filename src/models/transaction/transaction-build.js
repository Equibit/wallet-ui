import { bitcoin, eqbTxBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import typeforce from 'typeforce'

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
  typeforce(typeforce.tuple('Array', 'Array', types.Network), arguments)
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
  typeforce(typeforce.tuple('Array', 'Array', types.Network), arguments)
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
  toSatoshi
}
