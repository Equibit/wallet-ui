import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './send-popup'
import FormData from './form-data'
import portfolio from '~/models/mock/mock-portfolio'

describe('wallet-ui/components/trade-funds/send-popup/form-data', function () {
  it('should set fundsType to EQB when type is SECURITIES', function () {
    var formData = new FormData({
      portfolio,
      type: 'SECURITIES'
    })
    assert.equal(formData.fundsType, 'EQB')
  })
})
