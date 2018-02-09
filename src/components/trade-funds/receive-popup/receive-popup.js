/**
 * @module {can.Component} wallet-ui/components/trade-funds/receive-popup receive-popup
 * @parent components.portfolio
 *
 * A short description of the receive-popup component
 *
 * @signature `<receive-popup />`
 *
 * @link ../src/components/trade-funds/receive-popup/receive-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/receive-popup/receive-popup.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './receive-popup.less'
import view from './receive-popup.stache'
import hub from '~/utils/event-hub'
import copy from 'copy-to-clipboard'
import { translate } from '~/i18n/i18n'
import feathersClient from '~/models/feathers-client'

export const ViewModel = DefineMap.extend({
  /**
   * Object with two portfolio addresses: BTC and EQB.
   */
  address: {
    type: '*',

    // todo: we need to subscribe ONLY when generate a new address. This should be happening inside portfolio model.
    set (val) {
      val && val.BTC && feathersClient.service('/subscribe').create({
        addresses: [val.BTC]
      })
      val && val.EQB && feathersClient.service('/subscribe').create({
        addresses: [val.EQB]
      })
      return val
    }
  },
  copy (type) {
    copy(this.address[type])
    hub.dispatch({
      'type': 'alert',
      'kind': 'success',
      'title': translate('copiedToClipboard'),
      'displayInterval': 5000
    })
  },
  done (close) {
    this.dispatch('done')
    close()
  }
})

export default Component.extend({
  tag: 'receive-popup',
  ViewModel,
  view
})
