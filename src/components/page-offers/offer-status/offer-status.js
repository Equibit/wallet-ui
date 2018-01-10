/**
 * @module {can.Component} components/page-offers/offer-status offer-details > offer-status
 * @parent components.buy-sell-offers 6
 *
 * Shows a detailed status for an offer.
 *
 * @signature `<offer-status />`
 *
 * @link ../src/components/page-offers/offer-status/offer-status.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-status/offer-status.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import moment from 'moment'
import route from 'can-route'
import typeforce from 'typeforce'
import hub, { dispatchAlertError } from '../../../utils/event-hub'

import { translate } from '../../../i18n/i18n'
import './offer-status.less'
import view from './offer-status.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Issuance from '../../../models/issuance'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import { buildTransactionEqb } from '../../../models/transaction/transaction-build.js'

const enumSetter = values => value => {
  if (values.indexOf) {
    if (values.indexOf(value) !== -1) {
      return value
    } else {
      throw Error(`Unexpected enum value ${value}`)
    }
  }
  return value
}

export const ViewModel = DefineMap.extend({
  order: Order,
  offer: Offer,
  issuance: Issuance,
  status: {
    set: enumSetter(['OPEN', 'TRADING', 'CLOSED', 'CANCELLED', 'REJECTED'])
  },
  date: '*',
  get dateDisplay () {
    return moment(this.date).format('MM/DD @h:mm A')   // 04/29 @2:30 pm
  },
  collectSecurities () {
    console.log(`collectSecurities`, this.offer)
    typeforce('Offer', this.offer)

    const order = this.order
    const offer = this.offer
    const issuance = this.issuance
    const user = Session.current.user
    const portfolio = Session.current.portfolios[0]

    const inputs = [{
      txid: offer.htlcTxId2,
      vout: 0,
      keyPair: portfolio.findAddress(offer.eqbAddressTrading).keyPair,
      htlc: {
        secret: user.decrypt(offer.secretEncrypted),
        // Both refund address and timelock are necessary to recreate the corresponding subscript (locking script) for creating a signature.
        refundAddr: order.eqbAddressHolding,
        timelock: order.timelock || Math.floor(offer.timelock / 2)
      },
      sequence: '4294967295'
    }]
    const outputs = [{
      value: offer.quantity,
      address: offer.eqbAddressHolding,
      issuanceTxId: issuance.issuanceTxId
    }]

    const txInfo = buildTransactionEqb(inputs, outputs)

    const txConfig = {
      address: offer.eqbAddressHolding,
      addressTxid: inputs[0].txid,
      addressVout: inputs[0].vout,
      type: 'BUY',
      currencyType: 'EQB',
      amount: offer.quantity,
      description: 'Collecting securities from HTLC',
      hex: txInfo.hex,
      txId: txInfo.txId,
      fromAddress: offer.eqbAddressTrading,
      toAddress: offer.eqbAddressHolding,

      // Issuance details:
      companyName: offer.companyName,
      // companySlug: issuance.companySlug,
      issuanceId: offer.issuanceId,
      issuanceName: offer.issuanceName,
      issuanceType: offer.issuanceType
      // issuanceUnit: issuance.issuanceUnit
    }
    console.log(`collectSecurities txConfig:`, txConfig)

    const tx = new Transaction(txConfig)

    return tx.save()
      .then(tx => updateOffer(order, offer, tx))
      .then(() => dispatchAlert(hub, tx, route))
      .catch(dispatchAlertError)
  }
})

function updateOffer (offer, tx) {
  offer.htlcStep = 3
  offer.htlcTxId3 = tx.txId
  return offer.save()
}

function dispatchAlert (hub, tx, route) {
  if (!tx) {
    return
  }
  const url = route.url({ page: 'transactions', itemId: tx._id })
  return hub.dispatch({
    'type': 'alert',
    'kind': 'success',
    'title': translate('tradeWasUpdated'),
    'message': `<a href="${url}">${translate('viewTransaction')}</a>`,
    'displayInterval': 10000
  })
}

export default Component.extend({
  tag: 'offer-status',
  ViewModel,
  view
})
