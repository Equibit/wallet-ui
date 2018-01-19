/**
 * @module {can.Component} wallet-ui/components/trade-funds/collect-asset collect-asset
 * @parent components.common
 *
 * Input should include:
 *    - transaction (with address, amount and fee) and
 *    - issuance details.
 * Output would be:
 *    - timelock value and
 *    - description.
 *
 * @signature `<collect-asset />`
 *
 * @link ../src/wallet-ui/components/trade-funds/collect-asset/collect-asset.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/collect-asset/collect-asset.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './collect-asset.less'
import view from './collect-asset.stache'
import currencyConverter from '~/utils/btc-usd-converter'

const titles = {
  BTC: {
    header: 'Collect Payment',
    timer: 'collect payment',
    button: 'Collect & Close Deal'
  },
  EQB: {
    header: 'Collect Securities',
    timer: 'collect securities',
    button: 'Collect Securities'
  }
}

export const ViewModel = DefineMap.extend({
  tx: '*',
  issuance: '*',
  portfolio: '*',
  offerTimelock: {
    value: function () {
      return this.tx.timelock * 2
    }
  },
  formData: {
    get () {
      const tx = this.tx
      const issuance = this.issuance
      return {
        type: tx.currencyType,
        address: tx.fromAddress,
        issuanceName: issuance.companyName + ', ' + issuance.issuanceName,
        quantityBtc: tx.amount / 100000000,
        quantity: tx.amount,
        fee: tx.fee,
        totalAmount: (tx.amount + tx.fee),
        totalAmountBtc: (tx.amount + tx.fee) / 100000000,
        description: tx.description,
        portfolioName: this.portfolio.name
      }
    }
  },
  titles: {
    type: '*',
    value () {
      return titles[this.tx.currencyType || 'BTC']
    }
  },
  convertToUSD: function (value) {
    return currencyConverter.convert(value, 'EQBUSD')
  },
  send (close) {
    this.dispatch('send', [this.formData.description])
    close()
  }
})

export default Component.extend({
  tag: 'collect-asset',
  ViewModel,
  view
})
