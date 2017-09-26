/**
 * @module {can.Component} wallet-ui/components/page-my-issuances page-my-issuances
 * @parent components.common
 *
 * My Issuances page with a list of issuances of the logged-in user
 *
 * @signature `<page-my-issuances />`
 *
 * @link ../src/components/page-my-issuances/page-my-issuances.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-my-issuances/page-my-issuances.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-my-issuances.less'
import view from './page-my-issuances.stache'
import Issuance from '../../models/issuance'
import Session from '../../models/session'
import { sendIssuance } from '../page-portfolio/my-portfolio/my-portfolio'
import hub from '~/utils/event-hub'

export const ViewModel = DefineMap.extend({
  portfolio: {
    get (val) {
      if (val) {
        return val
      }
      return Session.current && Session.current.portfolios[0]
    }
  },
  isIssuacePopupVisible: 'boolean',
  isSendFundsPopup: 'boolean',
  issuances: {
    Type: Issuance.List,
    get (val, resolve) {
      if (val) {
        return val
      }
      Issuance.getList({userId: Session.current.user._id}).then(resolve)
    }
  },
  // toAddress: {
  //   get (val, resolve) {
  //     this.portfolio.getNextAddress().then(({ EQB }) => resolve(EQB))
  //   }
  // },

  addIssuance () {
    this.isIssuacePopupVisible = false
    this.isIssuacePopupVisible = true
  },
  createIssuance (issuance = {}) {
    console.log('Issuance created', issuance)
    this.issuances.push(issuance)
    this.isIssuacePopupVisible = false
  },
  openSendIssuance () {
    this.isSendFundsPopup = false
    this.isSendFundsPopup = true
  },
  sendIssuance () {
    const formData = args[1]
    console.log('send: ', formData)
    if (!formData) {
      console.error('Error: received no form data')
      return
    }
    sendIssuance(this.portfolio, formData)
      .then(() => {
        hub.dispatch({
          'type': 'alert',
          'kind': 'success',
          'title': `Securities were sent successfully`,
          'displayInterval': 5000
        })
      })
  }
})

export default Component.extend({
  tag: 'page-my-issuances',
  ViewModel,
  view
})
