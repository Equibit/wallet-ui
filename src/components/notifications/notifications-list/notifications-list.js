/**
 * @module {can.Component} components/notifications/notifications-list notifications-list
 * @parent components.notifications
 *
 * Shows a list of alerts.
 *
 * @signature `<notifications-list />`
 *
 * @link ../src/components/notifications/notifications-list/notifications-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/notifications/notifications-list/notifications-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import typeforce from 'typeforce'
import './notifications-list.less'
import view from './notifications-list.stache'
import Notification from '../../../models/notification'
import Session from '../../../models/session'
import Transaction from '~/models/transaction/'
import Offer from '~/models/offer'
import Issuance from '~/models/issuance'

export const ViewModel = DefineMap.extend({
  notifications: {
    Type: Notification.List
  },
  title (type) {
    return ({
      'IN': 'Transfer Received',
      'CANCEL': 'Cancelation of an issuance',
      'AUTH': 'Authentication of a new issuance'
    })[type] || ('Unknown Type ' + type)
  },
  'for' (addr) {
    const portfolio = Session.current && Session.current.portfolios && Session.current.portfolios.findByAddress(addr)
    return (portfolio && portfolio.name) || addr
  },
  popupData: {},
  offerModalShown: 'boolean',
  read (notification) {
    notification.isRead = true
    notification.save()
  },
  showOfferModal (notification) {
    Offer.get({ _id: notification.data.offerId })
    .then(offer => {
      if (offer.htlcStep > 3) {
        return
      }
      return Promise.all([
        Transaction.getList({
          txId: offer['htlcTxId' + notification.data.htlcStep],
          address: { $in: Session.current.allAddresses.BTC.concat(Session.current.allAddresses.EQB) }
        }),
        Issuance.get({ _id: offer.issuanceId })
      ]).then(([txes, issuance]) => {
        this.popupData = {
          tx: txes[0],
          issuance,
          offer,
          portfolio: Session.current.portfolios[0],
          sendFn: this.sendTransaction.bind(this)
        }
        this.offerModalShown = true
      })
    })
  },
  sendTransaction (description) {
    typeforce('?String', description)

    const offer = this.popupData.offer
    const tx = this.popupData.tx
    typeforce('Offer', offer)
    typeforce('Transaction', tx)

    return tx.sendForOffer(description, offer)
  }
})

export default Component.extend({
  tag: 'notifications-list',
  ViewModel,
  view
})
