import typeforce from 'typeforce'
import { merge, pick } from 'ramda'
import { eqbTxBuilder, txBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'

const buildTx = txBuilder.builder.buildTx
const hashTimelockContract = eqbTxBuilder.hashTimelockContract

// Having data models (offer, order, portfolio, issuance)
// create HTLC transaction in blockchain
// and instantiate Transaction for DB

/**
 * Creates HTLC transaction with H(x). Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 */
function createHtlc1 (offer, order, portfolio, issuance, changeAddrPair) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance', {EQB: types.Address, BTC: types.Address}), arguments)

  const htlcConfig = prepareHtlcConfig(offer, order, portfolio, changeAddrPair.BTC)
  const tx = buildTx(htlcConfig.buildConfig)
  const txData = prepareTxData(htlcConfig, tx, issuance)

  return txData
}

// HTLC-1 is a BTC transaction from <offer creator> to <order creator>
// case #1: Buy Offer / Sell Order. BTC currency type.
function prepareHtlcConfig (offer, order, portfolio, changeAddrPair) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', types.Address), arguments)

  const amount = offer.quantity * order.price
  const toAddress = order.btcAddress
  const refundAddress = offer.btcAddress
  const changeAddr = changeAddrPair.BTC

  // todo: calculate transaction fee:
  const fee = 1000

  // todo: figure out # of blocks VS absolute timestamp: (144 blocks/day).
  const timelock = offer.timelock
  const hashlock = offer.secretHash
  const htlcStep = 1

  const utxoInfo = portfolio.getTxouts(amount + fee, 'BTC')
  const availableAmount = utxoInfo.sum
  const utxo = utxoInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair, sequence: '4294967295'}))

  const script = hashTimelockContract(toAddress, refundAddress, hashlock, timelock)

  const buildConfig = {
    version: 1,
    locktime: 0,
    vin: pick(['txid', 'vout', 'keyPair', 'sequence'], utxo),
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
    amount,
    fee,
    type: offer.type,
    currencyType: 'BTC',
    description: `Buying securities (HTLC #${htlcStep})`
  }

  return { buildConfig, txInfo }
}

function prepareTxData (htlcConfig, tx, issuance) {
  return Object.assign(htlcConfig.txInfo, {
    hex: tx.hex,
    txId: tx.txId,
    issuanceId: issuance._id,
    companyName: issuance.companyName,
    companySlug: issuance.companySlug,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType,
    issuanceUnit: issuance.issuanceUnit
  })
}

// function _createHtlcTx (offer, order, portfolio, issuance, changeAddrPair) {
//   typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance', {EQB: 'String', BTC: 'String'}), arguments)
//   const amount = offer.quantity * order.price
//   const currencyType = offer.type === 'BUY' ? 'BTC' : 'EQB'
//   const toAddressA = offer.type === 'BUY' ? order.btcAddress : order.eqbAddressTrading
//   const toAddressB = offer.type === 'BUY' ? offer.btcAddress : offer.eqbAddressHolding
//   // todo: calculate transaction fee:
//   const transactionFee = 1000
//   // todo: figure out # of blocks VS absolute timestamp: (144 blocks/day).
//   const timelock = offer.timelock
//   const hashlock = offer.secretHash
//   const htlcStep = 1
//
//   const txouts = portfolio
//     .getTxouts(amount + transactionFee, currencyType).txouts
//     .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))
//
//   const options = {
//     fee: transactionFee,
//     changeAddr: offer.type === 'BUY' ? changeAddrPair.BTC : changeAddrPair.EQB,
//     type: offer.type,
//     currencyType,
//     description: (offer.type === 'BUY' ? 'Buying' : 'Selling') + ' securities (HTLC #1)',
//     issuance: issuance,
//     htlcStep
//   }
//
//   const txData = makeHtlc(amount, toAddressA, toAddressB, hashlock, timelock, txouts, options)
//
//   return new Transaction(txData)
// }

export {
  createHtlc1,
  prepareHtlcConfig,
  prepareTxData
}
