/**
 * @module {can.Component} components/common/button-group button-group
 * @parent components.common 0
 *
 * This component shows the conversion used for values that go up or down.
 *
 * ## Demo
 *
 * @demo src/components/common/button-group.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import { times } from 'ramda'
import view from './button-group.stache'
import './button-group.less'

const Button = DefineMap.extend({
  name: 'string',
  value: 'number',
  isSelected: 'boolean'
})

export const ViewModel = DefineMap.extend({
  amount: 'number',
  startWith: {
    type: 'number',
    value: 0
  },
  buttons: {
    value () {
      return new DefineList(times(i => {
        return new Button({ name: (i + this.startWith), value: (i + this.startWith) })
      }, this.amount))
    }
  },
  select (button) {
    this.selectedValue = button.value
  },
  selectedItem: '*',
  selectedValue: {
    type: 'number',
    set (val) {
      this.buttons.forEach(b => { b.isSelected = false })
      const button = this.buttons.reduce((selected, button) => {
        return selected || (button.value === val && button)
      }, null)
      if (button) {
        button.isSelected = true
      }
      this.selectedItem = button
      return val
    }
  }
})

export default Component.extend({
  tag: 'button-group',
  ViewModel,
  view
})
