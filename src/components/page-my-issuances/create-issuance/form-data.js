import DefineMap from 'can-define/map/map'
import Issuance from '../../../models/issuance'
import Company from '../../../models/company'
import Session from '../../../models/session'
import { toMaxPrecision } from '../../../utils/formatter'
import { translate } from '~/i18n/'

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
  changeAddr: '*',

  get amountEqb () {
    return this.amount / 100000000
  },
  get totalAmountEqb () {
    return this.totalAmount / 100000000
  },
  get transactionFeeEqb () {
    return this.transactionFee / 100000000
  },
  submissionAttempted: 'boolean',
  errors: {
    get: () => {
      return {
        companyMissing:
          this && // in certain automated tests, this is undefined
          this.submissionAttempted &&
          !this.issuance.companyId &&
          translate('requiredFieldError'),
        restrictionLevelMissing:
          this &&
          this.submissionAttempted &&
          typeof this.issuance.restriction === 'undefined' &&
          translate('requiredFieldError'),
        issuanceTypeMissing:
          this &&
          this.submissionAttempted &&
          !this.issuance.issuanceTypeItem &&
          translate('requiredFieldError'),
        issuanceNameMissing:
          this &&
          this.submissionAttempted &&
          !this.issuance.issuanceName &&
          translate('requiredFieldError')
      }
    }
  }
})

export default FormData
