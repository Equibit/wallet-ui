/**
 * @module {can.Component} <%= module %> <%= tag %>
 * @parent components.common
 *
 * A short description of the <%=tag %> component
 *
 * @signature `<<%=tag %> />`
 *
 * @link ../src/<%= module %>/<%=tag %>.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/<%= module %>/<%=tag %>.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './<%= name %>.less';
import view from './<%= name %>.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the <%= tag %> component'
  }
});

export default Component.extend({
  tag: '<%= tag %>',
  ViewModel,
  view
});
