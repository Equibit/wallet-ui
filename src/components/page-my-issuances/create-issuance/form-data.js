import DefineMap from 'can-define/map/map'
import Issuance from '../../../models/issuance'
import Company from '../../../models/company'
import Session from '../../../models/session'
import { toMaxPrecision } from '../../../utils/formatter'

const FormData = DefineMap({
  issuance: {
    get () {
      return new Issuance({
        userId: Session.current.user._id,
        sharesAuthorized: 100 * 1000 * 1000,
        issuanceUnit: 'SHARES'
      })
    }
  },
  amount: {
    get () {
      return this.issuance.sharesAuthorized
    }
  },
  companies: {
    get (val, resolve) {
      if (val) {
        return val
      }
      Company.getList({userId: Session.current.user._id}).then(resolve)
    }
  },
  issuances: '*',

  // Transaction related:
  portfolio: '*',
  get availableFunds () {
    const balance = this.portfolio.balance
    const availableFunds = toMaxPrecision(balance.cashEqb - this.transactionFee, 8)
    return availableFunds < 0 ? 0 : availableFunds
  },
  hasFunds: {
    get () {
      return (this.portfolio.balance['cashEqb'] - this.transactionFee) > 0
    }
  },
  hasEnoughFunds: {
    get () {
      return this.portfolio.hasEnoughFunds(this.totalAmount, 'EQB')
    }
  },

  transactionFee: {
    type: 'number',
    value: 1000
  },

  totalAmount: {
    get () {
      return this.amount + this.transactionFee
    }
  },

  get amountEqb () {
    return this.amount / 100000000
  },
  get totalAmountEqb () {
    return this.totalAmount / 100000000
  },
  get transactionFeeEqb () {
    return this.transactionFee / 100000000
  }
})

export default FormData
