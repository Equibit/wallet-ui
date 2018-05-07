/**
 * @module {can.Component} components/page-transactions/transactions-details transactions-details
 * @parent components.transactions
 *
 * This component shows the details of a transaction when selecting it from the `<transactions-grid>`.
 *
 * @signature `<transaction-details />`
 *
 * @link ../src/components/page-transactions/transactions-details/transaction-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-transactions/transactions-details/transactions-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './transactions-details.less'
import view from './transactions-details.stache'

export const ViewModel = DefineMap.extend({
  transaction: {
    type: '*'
  },
  // enum: [ 'progress', 'completed', 'canceled' ]
  status: {
    get () {
      // TODO: set status based on the number of confirmations (3 is enough for `completed`).
      return this.transaction && (this.transaction.type === 'TRANSFER')
        ? 'progress'
        : 'progress'
    }
  },
  to: {
    get () {
      return this.transaction.typeForUser === 'IN' ? this.portfolioName : this.transaction.toAddress
    }
  },
  from: {
    get () {
      return this.transaction.typeForUser === 'OUT' ? this.portfolioName : this.transaction.fromAddress
    }
  },
  portfolios: {
    type: '*'
  },
  portfolioName: {
    get () {
      const portfolio = this.portfolios &&
        (this.portfolios.findByAddress(this.transaction.fromAddress) || this.portfolios.findByAddress(this.transaction.toAddress))
      return (portfolio && portfolio.name) || (this.transaction.typeForUser === 'OUT' ? this.transaction.fromAddress : this.transaction.toAddress)
    }
  }
})

export default Component.extend({
  tag: 'transactions-details',
  ViewModel,
  view
})
