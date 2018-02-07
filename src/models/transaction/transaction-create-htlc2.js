import typeforce from 'typeforce'
import { merge, pick } from 'ramda'
import { eqbTxBuilder, types } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { buildTransaction } from './transaction-build'
import { prepareHtlcConfigBtc, prepareTxData } from './transaction-create-htlc1'

const hashTimelockContract = eqbTxBuilder.hashTimelockContract
// const simpleHashlockContract = eqbTxBuilder.simpleHashlockContract
// const simpleHashlockAddrContract = eqbTxBuilder.simpleHashlockAddrContract
// const simpleHashlockSigContract = eqbTxBuilder.simpleHashlockSigContract

/**
 * Creates HTLC transaction with H(x). Offer type is either 'BUY' or 'SELL'.
 * This is a high-level method to be called from a component VM.
 */
function createHtlc2 (offer, order, portfolio, issuance, changeAddr) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance', types.Address), arguments)
  typeforce(typeforce.tuple('Number', 'String'), [offer.timelock, offer.hashlock])

  const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'

  const htlcConfig = currencyType === 'EQB'
    ? prepareHtlcConfigEqb(offer, order, portfolio, issuance, changeAddr)
    : prepareHtlcConfigBtc(offer, order, portfolio, changeAddr)
  const tx = buildTransaction(currencyType)(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout)
  const txData = prepareTxData(htlcConfig, tx, issuance)

  txData.htlcStep = 2
  txData.description = order.type === 'SELL' ? 'Sending securities (HTLC #2)' : 'Sending payment (HTLC #2)'

  return txData
}

// HTLC-2 is an blockchain transaction from <order creator> to <offer creator>
//    - Ask flow (Sell order / Buy offer). EQB currency type.
//    - Bid flow (Buy order / Sell offer). BTC currency type.
function prepareHtlcConfigEqb (offer, order, portfolio, issuance, changeAddrEmptyEqb) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance', types.Address), arguments)

  const amount = offer.quantity
  // We reuse this method for both HTLC1 (Bid) and HTLC2 (Ask), so toAddress will be different:
  const toAddress = order.type === 'SELL' ? offer.eqbAddress : order.eqbAddress

  // todo: calculate transaction fee:
  const fee = 1000

  // Note: timelock for htlc2 should be smaller than htlc1 (e.g. 1/2):
  // Since we reuse this method for both Ask/Bid flows timelock is different.
  const timelock = order.type === 'SELL' ? offer.timelock2 : offer.timelock

  const hashlock = offer.hashlock

  // UTXO:
  // todo: validate that issuance and portfolio have enough utxo (results in a non-empty array).
  const issuanceUtxoInfo = issuance.getTxoutsFor(offer.quantity)
  if (!issuanceUtxoInfo.sum) {
    throw new Error(`Not enough UTXO for the authorized issuance of the amount ${offer.quantity}`)
  }
  const availableAmount = issuanceUtxoInfo.sum
  const issuanceUtxo = issuanceUtxoInfo.txouts
    .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

  // For Sell order we set both change addr for securities and the refund to the same holding address from where we send securities.
  const refundAddress = issuanceUtxo[0].address
  const changeAddr = refundAddress

  // For EQB the fee comes from empty EQB.
  const utxoEmptyEqbInfo = portfolio.getEmptyEqb(fee)
  if (!utxoEmptyEqbInfo.sum) {
    throw new Error(`Not enough empty EQB to cover the fee ${fee}`)
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
      // main output:
      value: amount,
      scriptPubKey: htlcScript,
      issuanceTxId: issuance.issuanceTxId
    }, {
      // change from the main output:
      value: availableAmount - amount,
      address: changeAddr,
      issuanceTxId: issuance.issuanceTxId
    }, {
      // change for Empty EQB (for transaction fee):
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
    refundAddress,
    amount,
    fee,
    type: order.type,
    currencyType: 'EQB',
    // description: `Selling securities (HTLC #${htlcStep})`,
    hashlock: offer.hashlock,
    timelock: timelock,
    buildConfig,
    offerId: offer._id
  }

  return { buildConfig, txInfo }
}

export {
  createHtlc2,
  prepareHtlcConfigEqb
}
