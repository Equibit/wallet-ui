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
import Order from '~/models/order'
import Issuance from '~/models/issuance'
import { translate } from '~/i18n/'
import { createHtlc4 } from '../../../models/transaction/transaction-create-htlc4'
import { createHtlc3 } from '../../../models/transaction/transaction-create-htlc3'

export const ViewModel = DefineMap.extend({
  notifications: {
    Type: Notification.List
  },
  title (type) {
    return ({
      'TRANSFER': translate('notificationTitleTransferTransaction'),
      'CANCEL': translate('notificationTitleCancelTransaction'),
      'AUTH': translate('notificationTitleAuthTransaction')
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
    const portfolio = Session.current.portfolios[0]
    const currencyTypesByOfferTypeAndStep = {
      BUY: [null, 'BTC', 'EQB', 'EQB', 'BTC'],
      SELL: [null, 'EQB', 'BTC', 'BTC', 'EQB']
    }
    const nextHtlcStep = notification.data.htlcStep + 1
    const currencyType = currencyTypesByOfferTypeAndStep[notification.data.type][nextHtlcStep]

    Promise.all([
      this.offerFor(notification),
      Order.get({ _id: notification.data.orderId }),
      portfolio.getNextAddress(true),
      Session.current.transactionFeeRatesPromise
    ])
    .then(([offer, order, addrPair, transactionFeeRates]) => {
      if (offer.htlcStep !== notification.data.htlcStep) {
        return
      }

      return Promise.all([
        offer.issuanceId && Issuance.get({ _id: offer.issuanceId }),
        offer.timelockInfoPromise
      ])
      .then(([issuance, timelockInfo]) => {
        const secret = offer.htlcStep === 3 ? offer.secret : Session.current.user.decrypt(offer.secretEncrypted)
        const createFn = ([null, null, null, createHtlc3, createHtlc4][nextHtlcStep])
        const txData = createFn(order, offer, portfolio, issuance, secret, addrPair[currencyType], transactionFeeRates.regular)
        const tx = new Transaction(txData)

        this.offerModalShown = false
        this.popupData = {
          tx,
          issuance,
          offer,
          portfolio: Session.current.portfolios[0],
          sendFn: this.sendTransaction.bind(this),
          offerTimelock: offer.htlcStep === 3 ? timelockInfo.fullEndAt : timelockInfo.partialEndAt
        }
        this.offerModalShown = true
      })
    })
  },
  offerFor (notification) {
    return Offer.get({ _id: notification.data.offerId })
  },
  sendTransaction (description) {
    typeforce('?String', description)

    const offer = this.popupData.offer
    const secret = offer.htlcStep === 3 ? offer.secret : Session.current.user.decrypt(offer.secretEncrypted)
    const tx = this.popupData.tx
    typeforce('Offer', offer)
    typeforce('Transaction', tx)

    return tx.sendForOffer(description, offer, secret)
  }
})

export default Component.extend({
  tag: 'notifications-list',
  ViewModel,
  view
})
