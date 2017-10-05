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
  value: 'string',
  isSelected: 'boolean'
})

export const ViewModel = DefineMap.extend({
  amount: 'number',
  startWith: {
    type: 'number',
    value: 0
  },
  get buttons () {
    return new DefineList(times(i => {
      return new Button({name: (i + this.startWith), value: (i + this.startWith)})
    }, this.amount))
  },
  select (button) {
    this.buttons.forEach(b => { b.isSelected = false })
    button.isSelected = true
    this.selectedItem = button
  },
  selectedItem: '*',
  get selectedValue () {
    return this.selectedItem && this.selectedItem.value
  }
})

export default Component.extend({
  tag: 'button-group',
  ViewModel,
  view
})
