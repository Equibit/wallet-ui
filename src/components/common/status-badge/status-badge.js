/**
 * @module {can.Component} components/common/status-badge status-badge
 * @parent components.common
 *
 * This component uses the [.label](bootstrap-custom___labels.less.html) class to display in a badge style a status.
 *
 * @signature `<status-badge />`
 *
 * @link ../src/components/common/status-badge/status-badge.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/status-badge/status-badge.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './status-badge.less';
import view from './status-badge.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the status-badge component'
  }
});

export default Component.extend({
  tag: 'status-badge',
  ViewModel,
  view
});
