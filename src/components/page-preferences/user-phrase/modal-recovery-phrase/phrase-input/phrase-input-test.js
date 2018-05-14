import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './phrase-input'

describe('components/page-preferences/user-phrase/modal-recovery-phrase/phrase-input', function () {
  const phrase = 'one two three four five six seven eight nine ten eleven twelve'

  describe('checkWords', function () {
    const vm = new ViewModel({ phrase })
    it('should contain random indexes and values', function () {
      console.log('vm.checkWords', vm.checkWords)
      assert.equal(vm.checkWords.indexes.length, 4)
      assert.equal(vm.checkWords.values.length, 4)
      assert.ok(vm.phrase.indexOf(vm.checkWords.values[0]) !== -1)
    })
  })
  describe('isCorrect', function () {
    it('should be faulsy by default', function () {
      const vm = new ViewModel({ phrase })
      assert.notOk(vm.isCorrect, 'initial value for isCorrect should be false')
    })
    it('should be ok when words are entered', function () {
      const vm = new ViewModel({ phrase })
      // To activate stream:
      vm.on('checkWords', () => {})
      const checkWords = vm.checkWords.values
      checkWords.forEach(word => vm.enteredWords.push(word))
      assert.equal(vm.enteredWords.length, 4)
      assert.ok(vm.isCorrect)
    })
  })
})
