/**
 * @module {can.Component} components/common/loading-indicator loading-indicator
 * @parent components.generic 3
 *
 * The loading indicator shows an icon spinner inside an overlay that will show on top of content.
 * To use place place as a first element inside of the content that you wish to overlay with a spinner
 * and set the parent container to `position: relative`.
 *
 * @signature `<loading-indicator />`
 *
 * @link ../src/components/common/loading-indicator/loading-indicator.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/loading-indicator/loading-indicator.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './loading-indicator.less';
import view from './loading-indicator.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the loading-indicator component'
  }
});

export default Component.extend({
  tag: 'loading-indicator',
  ViewModel,
  view
});
