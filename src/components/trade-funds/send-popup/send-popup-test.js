import './send-form/send-form-test'

import assert from 'chai/chai'
import 'steal-mocha'
// import { ViewModel } from './send-popup'
import FormData from './form-data'
import portfolio from '~/models/mock/mock-portfolio'

describe('wallet-ui/components/trade-funds/send-popup/form-data', function () {
  describe('fundsType', function () {
    it('should be set to EQB when type is ISSUANCE', function () {
      const formData = new FormData({
        portfolio,
        type: 'ISSUANCE'
      })
      assert.equal(formData.fundsType, 'EQB')
    })
  })
})
