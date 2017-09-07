/**
 * @module {can.Component} components/common/entity-info entity-info
 * @parent components.common
 *
 * Shows the information from an entity (company or authority)
 *
 * @signature `<entity-info />`
 *
 * @link ../src/components/common/entity-info/entity-info.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/entity-info/entity-info.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './entity-info.less'
import view from './entity-info.stache'

export const ViewModel = DefineMap.extend({
  entity: {
    type: '*'
  }
})

export default Component.extend({
  tag: 'entity-info',
  ViewModel,
  view
})
