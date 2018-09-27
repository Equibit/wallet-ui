import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './list-paginator'

describe('wallet-ui/src/components/common/list-paginator', function () {
  it('has 1 page for 0 items', function () {
    var vm = new ViewModel({ items: [] })
    assert.equal(vm.lastPageNumber, 1, 'last page number is correct')
  })
  it('has 1 page for 1 items', function () {
    var vm = new ViewModel({ items: [{}] })
    assert.equal(vm.lastPageNumber, 1, 'last page number is correct')
  })
  it('has 1 page for "pageSize" items', function () {
    var vm = new ViewModel()
    vm.items = new Array(vm.pageSize).fill({})
    assert.equal(vm.lastPageNumber, 1, 'last page number is correct')
  })
  it('has 2 pages for "pageSize" + 1 items', function () {
    var vm = new ViewModel()
    vm.items = new Array(vm.pageSize + 1).fill({})
    assert.equal(vm.lastPageNumber, 2, 'last page number is correct')
  })

  describe('.pagesToDisplay', function () {
    // Should look like e.g. [1, 2, 3] for length 3
    it('Less than or equal to max pages', function () {
      var vm = new ViewModel({ items: [] })
      for (let i = 1; i <= vm.maxPaginatorLength; i++) {
        vm.items = vm.items.concat(new Array(vm.pageSize).fill({}))
        assert.deepEqual(vm.pagesToDisplay, new Array(i).fill(null).map((_, j) => j + 1), 'Correct sequence for ' + i)
      }
    })
    // Should look like [1, 2, 3, 4, 5, null, 8] for max length 7
    it('More than max pages, current page at left bound', function () {
      var vm = new ViewModel({ items: [] })
      vm.items = vm.items.concat(new Array(vm.pageSize * (vm.maxPaginatorLength + 1)).fill({}))
      for (let i = 1; i <= 3; i++) {
        vm.currentPageNumber = i
        assert.deepEqual(
          vm.pagesToDisplay.slice(0, vm.maxPaginatorLength - 2),
          new Array(vm.maxPaginatorLength - 2).fill(null).map((_, j) => j + 1),
          'Correct sequence for ' + i
        )
        assert.equal(vm.pagesToDisplay[vm.pagesToDisplay.length - 2], null, 'Next to last is null')
        assert.equal(vm.pagesToDisplay[vm.pagesToDisplay.length - 1], vm.lastPageNumber, 'Last is last')
      }
    })
    // Should look like [1, 2, 3, 4, 5, null, 8] for max length 7
    it('More than max pages, current page at right bound', function () {
      var vm = new ViewModel({ items: [] })
      vm.items = vm.items.concat(new Array(vm.pageSize * (vm.maxPaginatorLength + 1)).fill({}))
      for (let i = vm.lastPageNumber - 2; i <= vm.lastPageNumber; i++) {
        vm.currentPageNumber = i
        assert.deepEqual(
          vm.pagesToDisplay.slice(2, vm.maxPaginatorLength),
          new Array(vm.maxPaginatorLength - 2).fill(null).map((_, j) => j + 4),
          'Correct sequence for ' + i
        )
        assert.equal(vm.pagesToDisplay[1], null, 'Next to first is null')
        assert.equal(vm.pagesToDisplay[0], 1, 'First is first')
      }
    })
    it('More than max pages, current page in middle', function () {
      var vm = new ViewModel({ items: [] })
      vm.items = vm.items.concat(new Array(vm.pageSize * (vm.maxPaginatorLength + 2)).fill({}))
      let i = Math.floor(vm.maxPaginatorLength / 2)
      vm.currentPageNumber = Math.floor(vm.lastPageNumber / 2)
      assert.deepEqual(
        vm.pagesToDisplay.slice(i - 1, i + 2),
        new Array(3).fill(null).map((_, j) => vm.currentPageNumber - 1 + j),
        'Correct sequence for ' + i
      )
      assert.equal(vm.pagesToDisplay[1], null, 'Next to first is null')
      assert.equal(vm.pagesToDisplay[0], 1, 'First is first')
      assert.equal(vm.pagesToDisplay[vm.pagesToDisplay.length - 2], null, 'Next to last is null')
      assert.equal(vm.pagesToDisplay[vm.pagesToDisplay.length - 1], vm.lastPageNumber, 'Last is last')
    })
  })
})
