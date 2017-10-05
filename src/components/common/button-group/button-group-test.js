import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './button-group'

describe('components/common/button-group', function () {
  let vm
  beforeEach(function () {
    vm = new ViewModel({
      amount: 5
    })
  })
  describe('buttons', function () {
    it('should be a list of `amount` length', function () {
      assert.equal(vm.buttons.length, 5)
    })
    it('should have the last item with name and value of 4', function () {
      assert.equal(vm.buttons[4].name, '4')
      assert.equal(vm.buttons[4].value, '4')
    })
  })
  describe('select()', function () {
    it('should select the given button', function () {
      const button = vm.buttons[0]
      vm.select(button)
      assert.equal(vm.selectedItem, button)
      assert.equal(vm.selectedValue, button.value)
    })
  })
})
