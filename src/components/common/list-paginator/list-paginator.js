/**
 * @module {can.Component} wallet-ui/src/components/common/list-paginator list-paginator
 * @parent components.common
 *
 * A short description of the list-paginator component
 *
 * @signature `<list-paginator />`
 *
 * @link ../src/wallet-ui/src/components/common/list-paginator/list-paginator.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/src/components/common/list-paginator/list-paginator.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './list-paginator.less'
import view from './list-paginator.stache'
import canBatch from 'can-event/batch/'

export const ViewModel = DefineMap.extend({
  items: {
    value: [],
    set () {
      canBatch.after(() => { this.currentPageNumber = 1 })
    }
  },
  pageSize: {
    type: 'number',
    value: 10
  },
  lastPageNumber: {
    get () {
      return Math.max(Math.ceil(this.items.length / this.pageSize), 1)
    }
  },
  pagedItems: {
    get () {
      const leftBound = this.pageSize * (this.currentPageNumber - 1)
      return this.items.slice(leftBound, leftBound + this.pageSize)
    }
  },
  currentPageNumber: {
    type: 'number',
    value: 1,
    set (val) {
      return val < 1 ? 1 : val > this.lastPageNumber ? this.lastPageNumber : val
    }
  },
  maxPaginatorLength: {
    type: 'number',
    value: 7
  },
  pagesToDisplay: {
    get () {
      const maxPaginatorLength = this.maxPaginatorLength
      const pages = new Array(Math.min(maxPaginatorLength, this.lastPageNumber)).fill(null).map((_, i) => i + 1)
      if (maxPaginatorLength < this.lastPageNumber) {
        for (let i = 1; i < maxPaginatorLength; i++) {
          switch (i) {
            case 1:
              if (this.currentPageNumber > 3) {
                pages[i] = null
              }
              break
            case pages.length - 1:
              pages[i] = this.lastPageNumber
              break
            case pages.length - 2:
              if (this.currentPageNumber < this.lastPageNumber - 2) {
                pages[i] = null
              } else {
                pages[i] = this.lastPageNumber - 1
              }
              break
            default:
              const pivot = this.currentPageNumber < 4
                ? Math.floor(maxPaginatorLength / 2) + 1
                : this.currentPageNumber > this.lastPageNumber - 3
                  ? this.lastPageNumber - Math.floor(maxPaginatorLength / 2)
                  : this.currentPageNumber
              pages[i] = pivot - Math.floor(maxPaginatorLength / 2) + i
          }
        }
      }
      return pages
    }
  },
  next () {
    this.currentPageNumber++
  },
  prev () {
    this.currentPageNumber--
  }
})

export default Component.extend({
  tag: 'list-paginator',
  ViewModel,
  view
})
