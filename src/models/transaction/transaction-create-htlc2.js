import typeforce from 'typeforce'
import { merge, pick } from 'ramda'
import { eqbTxBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareTxData } from './transaction-create-htlc1'

const hashTimelockContract = eqbTxBuilder.hashTimelockContract

/**
 * Creates HTLC transaction with H(x). Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 */
function createHtlc2 (offer, order, portfolio, issuance, changeAddrPair) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance', {EQB: types.Address, BTC: types.Address}), arguments)
  typeforce(typeforce.tuple('Number', 'String'), [offer.timelock, offer.hashlock])

  const htlcConfig = prepareHtlcConfig2(offer, order, portfolio, issuance, changeAddrPair.EQB)
  const tx = buildTransaction('EQB')(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout)
  const txData = prepareTxData(htlcConfig, tx, issuance)

  return txData
}

// HTLC-2 is an EQB transaction from <order creator> to <offer creator>
// case #1: Buy Offer / Sell Order. EQB currency type.
function prepareHtlcConfig2 (offer, order, portfolio, issuance, changeAddrEmptyEqb) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance', types.Address), arguments)

  const amount = offer.quantity
  const toAddress = offer.eqbAddressTrading
  const refundAddress = order.eqbAddressHolding
  const changeAddr = order.eqbAddressHolding

  // todo: calculate transaction fee:
  const fee = 1000

  // todo: figure out # of blocks VS absolute timestamp: (144 blocks/day).
  // Note: timelock for the 2nd tx should be twice smaller:
  const timelock = Math.floor(offer.timelock / 2)
  const hashlock = offer.hashlock
  const htlcStep = 2

  // UTXO:
  // todo: validate that issuance and portfolio have enough utxo (results in a non-empty array).
  const issuanceUtxoInfo = issuance.getTxoutsFor(offer.quantity)
  if (!issuanceUtxoInfo.sum) {
    throw new Error('Not enough UTXO for the issuance')
  }
  const availableAmount = issuanceUtxoInfo.sum
  const issuanceUtxo = issuanceUtxoInfo.txouts
    .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

  // For EQB the fee comes from empty EQB.
  const utxoEmptyEqbInfo = portfolio.getEmptyEqb(fee)
  if (!utxoEmptyEqbInfo.sum) {
    throw new Error('Not enough empty EQB to cover the fee')
  }
  const availableAmountEmptyEqb = utxoEmptyEqbInfo.sum
  const utxoEmptyEqb = utxoEmptyEqbInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))

  const utxo = issuanceUtxo.concat(utxoEmptyEqb)

  // HTLC SCRIPT:
  const htlcScript = hashTimelockContract(toAddress, refundAddress, hashlock, timelock)
  console.log(`htlcScript = ${htlcScript.toString('hex')}`)

  const buildConfig = {
    vin: utxo.map(pick(['txid', 'vout', 'keyPair'])),
    vout: [{
      value: amount,
      scriptPubKey: htlcScript,
      issuanceTxId: issuance.issuanceTxId
    }, {
      value: availableAmount - amount,
      address: changeAddr
    }, {
      value: availableAmountEmptyEqb - fee,
      address: changeAddrEmptyEqb
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
    type: order.type,
    currencyType: 'EQB',
    description: `Selling securities (HTLC #${htlcStep})`,
    hashlock: offer.hashlock,
    timelock: timelock,
    htlcStep
  }

  return { buildConfig, txInfo }
}

export {
  createHtlc2,
  prepareHtlcConfig2
}
