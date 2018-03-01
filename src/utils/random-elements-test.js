import assert from 'chai/chai'
import 'steal-mocha'
import DefineList from 'can-define/list/list'
import randomElements, { shuffle, pickFromList } from './random-elements'

import './stache-helpers/stache-helpers'
import '~/models/mock/mock-session'

describe('utils/random-elements', function () {
  describe('shuffle', function () {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle(arr.slice())
    const sum = (acc, a) => acc + a
    console.log('shuffle ', arr, shuffled)
    it('should contain the same elements', function () {
      assert.equal(arr.reduce(sum, 0), shuffled.reduce(sum, 0))
    })
    it.skip('should not have the same order', function () {
      assert.notDeepEqual(arr, shuffled)
    })
  })
  describe('pickFromList', function () {
    const indexes = [1, 2, 4]
    const array = [1, 2, 3, 4, 5]
    it('should pick elements', function () {
      assert.deepEqual(pickFromList(indexes, array), [2, 3, 5])
    })
    it('should pick elements of DefineList', function () {
      const list = new DefineList(array)
      assert.deepEqual(pickFromList(indexes, list.slice()).get(), [2, 3, 5])
    })
  })
  describe('randomElements', function () {
    const list = new DefineList([1, 2, 3, 4, 5])
    const randomized = randomElements(list, 3)
    console.log('randomized', list, randomized)
    it('should contain the desired number of elements of indexes and values', function () {
      assert.equal(randomized.indexes.length, 3)
      assert.equal(randomized.values.length, 3)
    })
    it('should return the correct 1st value', function () {
      const index = randomized.indexes[0]
      const value = randomized.values[0]
      assert.equal(value, list[index])
    })
  })
})
