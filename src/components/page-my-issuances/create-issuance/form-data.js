import Issuance from '../../../models/issuance'
import Company from '../../../models/company'
import Session from '../../../models/session'
import { toMaxPrecision } from '../../../utils/formatter'

const FormData = DefineMap({
  issuance: {
    value: new Issuance({
      sharesAuthorized: 100 * 1000 * 1000
    })
  },
  amount: {
    get () {
      return this.issuance.sharesAuthorized / 100000000
    }
  },
  selectedCompany: '*',
  companies: {
    get (val, resolve) {
      Company.getList({userId: Session.current.user._id}).then(resolve)
    }
  },

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
      return this.portfolio.hasEnoughFunds(this.amount + this.transactionFee, 'EQB')
    }
  },
  price: 'number',
  transactionFee: {
    type: 'number',
    value: 0.00001
  },

  get amountPrice () {
    return toMaxPrecision(this.eqbToUsd(this.amount), 2)
  },
  get transactionFeePrice () {
    return toMaxPrecision(this.eqbToUsd(this.transactionFee), 2)
  },
  get totalAmount () {
    return this.amount + this.transactionFee
  },
  get totalPrice () {
    return this.amountPrice + this.transactionFeePrice
  },
  eqbToUsd (EQB) {
    return EQB * Session.current.rates.eqbToUsd
  }
})

export default FormData
