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
import currencyConverter from '~/utils/currency-converter'

const titles = {
  BTC: {
    header: 'dealFlowMessageTitleCollectPayment',
    timer: 'paymentCollectionTimeLeftDescription',
    button: 'dealFlowMessageTitleCollectAndCloseDeal'
  },
  EQB: {
    header: 'dealFlowMessageTitleCollectSecurities',
    timer: 'securitiesCollectionTimeLeftDescription',
    button: 'dealFlowMessageTitleCollectSecurities'
  },
  blankEqb: {
    header: 'dealFlowMessageTitleCollectBlankEqb',
    timer: 'blankEqbCollectionTimeLeftDescription',
    button: 'dealFlowMessageTitleCollectBlankEqb'
  }
}

export const ViewModel = DefineMap.extend({
  tx: '*',
  issuance: '*',
  portfolio: '*',
  offerTimelock: {
    value: null
  },
  formData: {
    get () {
      const tx = this.tx
      const issuance = this.issuance
      return new DefineMap({
        type: tx.currencyType,
        assetType: tx.assetType,
        address: tx.fromAddress,
        issuanceName: issuance && (issuance.companyName + ', ' + issuance.issuanceName),
        quantityBtc: tx.amount / 100000000,
        quantity: tx.amount,
        amountMinusFee: tx.amount - tx.fee,
        fee: tx.fee,
        totalAmount: (tx.amount + tx.fee),
        totalAmountBtc: (tx.amount + tx.fee) / 100000000,
        description: tx.description,
        portfolioName: this.portfolio.name
      })
    }
  },
  titles: {
    type: '*',
    get (lastSetVal) {
      let titleProp = this.tx.currencyType === 'EQB' && this.tx.assetType === 'EQUIBIT' ? 'blankEqb' : this.tx.currencyType
      return lastSetVal ? lastSetVal[titleProp] : titles[titleProp || 'BTC']
    }
  },
  convertToUSD: function (value) {
    return currencyConverter.convertToUserFiat(value, 'EQB', currencyConverter.unit)
  },
  sendFn: '*',
  isSending: {
    value: false
  },
  send (close) {
    this.isSending = true
    this.sendFn(this.formData.description)
      .then(() => {
        this.isSending = false
        close()
      })
      .catch(err => {
        this.isSending = false
        close()
        throw err
      })
  }
})

export default Component.extend({
  tag: 'collect-asset',
  ViewModel,
  view
})
