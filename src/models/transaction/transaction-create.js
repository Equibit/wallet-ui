import { merge } from 'ramda'
import typeforce from 'typeforce'
import { makeHtlc } from './transaction-make'

/**
 * Creates a transaction from order and offer information.
 * This is the 2nd HTLC transaction (#2 of 4 trade transactions).
 * Case: Sell issuance:
 * - amount is EQB quantity
 * - receiverA: eqbAddress
 * - from, receiverB, changeAddr: portfolio address or issuanceAddress
 */
function createHtlcTx2Old (offer, order, portfolio, issuance, changeAddrPair) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance'), arguments)

  // Amount of BTC/EQB to send:
  const amount = offer.quantity

  // todo: figure out # of blocks VS absolute timestamp: (144 blocks/day).
  // Note: timelock for the 2nd tx should be twice smaller:
  const timelock = Math.floor(offer.timelock / 2)
  const hashlock = offer.hashlock

  const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'

  const { toAddressA, toAddressB, utxo, options } = currencyType === 'BTC'
    ? prepareHtlc2Btc(offer, order, portfolio, issuance, changeAddrPair.BTC)
    : prepareHtlc2Eqb(offer, order, portfolio, issuance, changeAddrPair.EQB)

  return makeHtlc(amount, toAddressA, toAddressB, hashlock, timelock, utxo, options)
}

function prepareHtlc2Btc (offer, order, portfolio, issuance, changeAddr) {
  const htlcStep = 2

  // Addresses for HTLC script:
  const toAddressA = offer.btcAddress
  const toAddressB = order.btcAddress

  // todo: calculate fee.
  const transactionFee = 1000

  // Main utxo to cover the amount and transaction fee:
  const utxoInfo = portfolio.getTxouts(offer.quantity + transactionFee, 'BTC')
  const utxo = utxoInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))

  const options = {
    fee: transactionFee,
    changeAddr: changeAddr,
    type: 'TRADE',
    currencyType: 'BTC',
    description: `Buying securities (HTLC #${htlcStep})`,
    issuance: issuance,
    htlcStep,
    offerId: offer._id,
    costPerShare: offer.price
  }

  return { toAddressA, toAddressB, utxo, options }
}

function prepareHtlc2Eqb (offer, order, portfolio, issuance, blankEqbChangeAddr) {
  const htlcStep = 2

  // Addresses for HTLC script:
  const toAddressA = offer.eqbAddress
  const toAddressB = order.eqbAddress

  // todo: calculate fee.
  const transactionFee = 1000

  // Main utxo to cover the amount:
  const utxoInfo = issuance.getTxoutsFor(offer.quantity)
  const utxo = utxoInfo.txouts
    .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

  // todo: get utxo of blank EQB here (pass a predicate fn).
  // For EQB transactionFee comes from blank EQB.
  const utxoBlankEqbInfo = portfolio.getBlankEqb(transactionFee)
  const blankEqbUtxo = utxoBlankEqbInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))

  const options = {
    fee: transactionFee,
    changeAddr: order.btcAddress,
    type: 'TRADE',
    currencyType: 'EQB',
    description: `Buying securities (HTLC #${htlcStep})`,
    issuance: issuance,
    htlcStep,
    blankEqbAmount: utxoBlankEqbInfo.sum,
    blankEqbUtxo,
    blankEqbChangeAddr,
    offerId: offer._id,
    costPerShare: offer.price
  }

  return { toAddressA, toAddressB, utxo, options }
}

export {
  createHtlcTx2Old,
  prepareHtlc2Btc,
  prepareHtlc2Eqb
}
