import assert from 'chai/chai'
import 'steal-mocha'
import Order from '../../../models/order'
import { ViewModel } from './place-offer'
import FormData from './form-data'

describe('wallet-ui/components/trade-funds/place-offer', function () {
  it('should have default mode "edit"', function () {
    const vm = new ViewModel()
    assert.equal(vm.mode, 'edit')
  })

  describe('formData', function () {
    let formData
    before(function () {
      formData = new FormData({
        order: new Order({
          type: 'SELL',
          price: 120,
          isFillOrKill: false,
          quantity: 50
        }),
        fee: 3000
      })
    })

    // Quantity and price:
    it('should set quantity to default 0 if its not fillOrKill', function () {
      formData.order.isFillOrKill = false
      assert.equal(formData.quantity, 0)
    })
    it('should set quantity to order quantity if its fillOrKill', function () {
      formData.order.isFillOrKill = true
      assert.equal(formData.quantity, 50)
    })
    it('should set uBtcPrice', function () {
      assert.equal(formData.uBtcPrice, 1.2)
    })
    it('should set uBtcTotalPrice', function () {
      assert.equal(formData.uBtcTotalPrice, 60)
    })
    it('should set totalPrice', function () {
      assert.equal(formData.totalPrice, 6000)
    })
    it('should set totalPriceWithFee', function () {
      assert.equal(formData.totalPriceWithFee, 9000)
    })

    // Other:
    it('should set flowType', function () {
      assert.equal(formData.flowType, 'Ask')
    })
    it('should set currencyType', function () {
      assert.equal(formData.currencyType, 'BTC')
    })
  })
})
