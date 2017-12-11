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
function createHtlcTx2 (offer, order, portfolio, issuance) {
  typeforce(typeforce.tuple('Offer', 'Order', 'Portfolio', 'Issuance'), arguments)

  const amount = offer.quantity
  const currencyType = order.type === 'SELL' ? 'EQB' : 'BTC'
  const toAddressA = order.type === 'SELL' ? offer.eqbAddressTrading : order.btcAddress
  const toAddressB = order.type === 'SELL' ? order.eqbAddressHolding : order.btcAddress
  // todo: figure out # of blocks VS absolute timestamp: (144 blocks/day).
  // Note: timelock for the 2nd tx should be twice smaller:
  const timelock = Math.floor(offer.timelock / 2)
  const hashlock = offer.secretHash
  const htlcStep = 2
  // todo: calculate fee.
  const transactionFee = 1000

  const utxo = issuance.getTxoutsFor(amount)
    .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

  // todo: get utxo of empty EQB here (pass a predicate fn).
  const utxoFee = portfolio
    .getTxouts(transactionFee, currencyType)
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))
  utxo.push.apply(utxo, utxoFee)

  // Note: for a change EQB address we use the same fromAddress (securities need to stay at the same address).
  const options = {
    fee: transactionFee,
    changeAddr: order.type === 'SELL' ? order.eqbAddressHolding : order.btcAddress,
    type: offer.type,
    currencyType,
    description: (order.type === 'BUY' ? 'Buying' : 'Selling') + ` securities (HTLC #${htlcStep})`,
    issuance: issuance,
    htlcStep
  }
  return makeHtlc(amount, toAddressA, toAddressB, hashlock, timelock, utxo, options)
}

export {
  createHtlcTx2
}
